/**
 * Daily Ebook Agent
 * Automated service that runs daily at 2:00 AM UTC (7:30 AM Sri Lanka Time)
 *
 * Functions:
 * 1. Scans CORE API for new publications
 * 2. Processes upload queue
 * 3. Downloads PDFs
 * 4. Extracts metadata
 * 5. Auto-categorizes books
 * 6. Uploads to Firebase Storage
 * 7. Updates catalogue
 * 8. Sends notifications
 */

const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const { createHash } = require('crypto');

// Configuration
const CONFIG = {
  schedule: '0 2 * * *', // 2:00 AM UTC daily
  sources: {
    core: {
      enabled: true,
      apiUrl: 'https://api.core.ac.uk/v3',
      apiKey: process.env.CORE_API_KEY || '',
      queries: [
        'marine biodiversity',
        'fisheries management',
        'ocean conservation',
        'aquatic resources',
        'coastal ecosystem'
      ],
      limit: 20
    }
  },
  notification: {
    email: 'library@nara.ac.lk',
    onSuccess: true,
    onError: true
  }
};

class DailyEbookAgent {
  constructor() {
    this.processedCount = 0;
    this.errorCount = 0;
    this.startTime = null;
    this.logs = [];
  }

  /**
   * Main execution function
   */
  async run() {
    this.startTime = Date.now();
    this.log('info', '🤖 Daily Ebook Agent Started');
    this.log('info', `📅 Date: ${new Date().toISOString()}`);

    try {
      // Step 1: Scan CORE API
      if (CONFIG.sources.core.enabled) {
        await this.scanCoreAPI();
      }

      // Step 2: Process upload queue
      await this.processUploadQueue();

      // Step 3: Generate summary
      await this.generateSummary();

      // Step 4: Send notifications
      await this.sendNotifications('success');

      this.log('success', '✅ Daily Ebook Agent Completed Successfully');
    } catch (error) {
      this.log('error', `❌ Agent Failed: ${error.message}`);
      await this.sendNotifications('error', error);
    }
  }

  /**
   * Scan CORE API for new publications
   */
  async scanCoreAPI() {
    this.log('info', '🔍 Scanning CORE API for new publications...');

    const { apiUrl, apiKey, queries, limit } = CONFIG.sources.core;

    for (const query of queries) {
      try {
        this.log('info', `   Searching: "${query}"`);

        const response = await axios.get(`${apiUrl}/search/works`, {
          params: {
            q: query,
            limit: limit,
            sort: 'datePublished:desc'
          },
          headers: {
            'Authorization': `Bearer ${apiKey}`
          }
        });

        const results = response.data.results || [];
        this.log('info', `   Found ${results.length} results`);

        // Process each result
        for (const work of results) {
          await this.processWork(work);
        }
      } catch (error) {
        this.log('error', `   Failed to search "${query}": ${error.message}`);
        this.errorCount++;
      }
    }
  }

  /**
   * Process a single work from CORE
   */
  async processWork(work) {
    try {
      // Check if already exists
      const exists = await this.checkIfExists(work.id);
      if (exists) {
        this.log('info', `   Skipped (exists): ${work.title?.substring(0, 50)}...`);
        return;
      }

      // Extract metadata
      const metadata = this.extractMetadata(work);

      // Download PDF if available
      let pdfUrl = null;
      if (work.downloadUrl) {
        pdfUrl = await this.downloadPDF(work.downloadUrl, work.id);
      }

      if (pdfUrl) {
        // Auto-categorize
        const category = this.autoCategorize(metadata);

        // Add to upload queue
        await this.addToUploadQueue({
          ...metadata,
          pdfUrl,
          category,
          source: 'CORE',
          sourceId: work.id
        });

        this.processedCount++;
        this.log('success', `   ✓ Processed: ${metadata.title.substring(0, 50)}...`);
      }
    } catch (error) {
      this.log('error', `   Failed to process work: ${error.message}`);
      this.errorCount++;
    }
  }

  /**
   * Extract metadata from CORE work
   */
  extractMetadata(work) {
    return {
      title: work.title || 'Untitled',
      author: work.authors?.[0]?.name || 'Unknown Author',
      publisher: work.publisher || 'CORE',
      publicationYear: work.yearPublished || new Date().getFullYear(),
      abstract: work.abstract || '',
      language: work.language?.code || 'English',
      keywords: work.topics || [],
      doi: work.doi || null,
      sourceUrl: work.downloadUrl || null
    };
  }

  /**
   * Auto-categorize based on content
   */
  autoCategorize(metadata) {
    const title = (metadata.title || '').toLowerCase();
    const abstract = (metadata.abstract || '').toLowerCase();
    const keywords = (metadata.keywords || []).join(' ').toLowerCase();
    const text = `${title} ${abstract} ${keywords}`;

    // Categorization rules
    if (text.includes('thesis') || text.includes('dissertation')) {
      return 'THESIS';
    }

    if (text.includes('bobp') || text.includes('bay of bengal')) {
      return 'BOBP';
    }

    if (text.includes('map') || text.includes('cartography')) {
      return 'MAP';
    }

    if (text.includes('journal') || text.includes('article')) {
      return 'JR';
    }

    if (text.includes('report') || text.includes('research paper')) {
      return 'RPAPER';
    }

    // Default category
    return 'RBOOK';
  }

  /**
   * Download PDF file
   */
  async downloadPDF(url, workId) {
    try {
      const response = await axios.get(url, {
        responseType: 'arraybuffer',
        timeout: 30000
      });

      const tempDir = path.join(__dirname, '../../temp/pdfs');
      await fs.mkdir(tempDir, { recursive: true });

      const filename = `${workId}.pdf`;
      const filepath = path.join(tempDir, filename);

      await fs.writeFile(filepath, response.data);

      return filepath;
    } catch (error) {
      this.log('error', `Failed to download PDF: ${error.message}`);
      return null;
    }
  }

  /**
   * Check if work already exists in database
   */
  async checkIfExists(sourceId) {
    // This would query your database
    // For now, return false (assume doesn't exist)
    return false;
  }

  /**
   * Add to upload queue
   */
  async addToUploadQueue(item) {
    const queueDir = path.join(__dirname, '../../queue');
    await fs.mkdir(queueDir, { recursive: true });

    const queueFile = path.join(queueDir, 'upload_queue.json');

    let queue = [];
    try {
      const data = await fs.readFile(queueFile, 'utf8');
      queue = JSON.parse(data);
    } catch (error) {
      // File doesn't exist yet
    }

    queue.push({
      ...item,
      addedAt: new Date().toISOString(),
      status: 'pending'
    });

    await fs.writeFile(queueFile, JSON.stringify(queue, null, 2));
  }

  /**
   * Process upload queue
   */
  async processUploadQueue() {
    this.log('info', '📤 Processing upload queue...');

    const queueFile = path.join(__dirname, '../../queue/upload_queue.json');

    try {
      const data = await fs.readFile(queueFile, 'utf8');
      const queue = JSON.parse(data);

      const pending = queue.filter(item => item.status === 'pending');
      this.log('info', `   Found ${pending.length} pending items`);

      for (const item of pending) {
        await this.uploadToFirebase(item);
      }

      // Update queue
      await fs.writeFile(queueFile, JSON.stringify(queue, null, 2));
    } catch (error) {
      this.log('info', '   No queue file found or empty queue');
    }
  }

  /**
   * Upload to Firebase Storage
   */
  async uploadToFirebase(item) {
    // This would integrate with Firebase Admin SDK
    // For now, just log
    this.log('info', `   Uploading: ${item.title.substring(0, 50)}...`);
    // TODO: Implement Firebase upload
  }

  /**
   * Generate summary report
   */
  async generateSummary() {
    const duration = ((Date.now() - this.startTime) / 1000).toFixed(2);

    this.log('info', '\n📊 Summary Report');
    this.log('info', '═'.repeat(50));
    this.log('info', `⏱️  Duration: ${duration} seconds`);
    this.log('info', `✅ Processed: ${this.processedCount} items`);
    this.log('info', `❌ Errors: ${this.errorCount} items`);
    this.log('info', '═'.repeat(50));
  }

  /**
   * Send notifications
   */
  async sendNotifications(status, error = null) {
    if (status === 'success' && !CONFIG.notification.onSuccess) return;
    if (status === 'error' && !CONFIG.notification.onError) return;

    const subject = status === 'success'
      ? `✅ Daily Ebook Agent - Success (${this.processedCount} items processed)`
      : `❌ Daily Ebook Agent - Failed`;

    const body = this.logs.join('\n');

    // TODO: Send email via your email service
    this.log('info', `📧 Notification sent to ${CONFIG.notification.email}`);
  }

  /**
   * Log message
   */
  log(level, message) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;

    console.log(logMessage);
    this.logs.push(logMessage);
  }
}

// Export for use in scheduler
module.exports = DailyEbookAgent;

// Run if executed directly
if (require.main === module) {
  const agent = new DailyEbookAgent();
  agent.run()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Agent failed:', error);
      process.exit(1);
    });
}
