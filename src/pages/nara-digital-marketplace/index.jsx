import { useState } from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { Link } from 'react-router-dom';

const PRODUCT_CATEGORIES = [
  { id: 'all', name: 'All Products', icon: Icons.Store },
  { id: 'datasets', name: 'Digital Datasets', icon: Icons.Database },
  { id: 'reports', name: 'Research Reports', icon: Icons.FileText },
  { id: 'software', name: 'Software & Tools', icon: Icons.Code },
  { id: 'courses', name: 'Online Courses', icon: Icons.GraduationCap },
  { id: 'subscriptions', name: 'API & Subscriptions', icon: Icons.Cloud }
];

const MARKETPLACE_PRODUCTS = [
  {
    id: 'bathymetry-dataset',
    category: 'datasets',
    name: 'Sri Lanka EEZ Bathymetry Dataset',
    description: 'High-resolution bathymetric data for Sri Lankan waters, GeoTIFF format, 10m resolution',
    price: 45000,
    unit: 'one-time purchase',
    image: '🗺️',
    stock: 'Instant Download',
    certification: 'ISO 19115 Metadata Standard',
    badge: 'Best Seller'
  },
  {
    id: 'ocean-temp-data',
    category: 'datasets',
    name: 'Historical Ocean Temperature Data',
    description: '20-year SST dataset (2005-2025), CSV/NetCDF formats, daily measurements',
    price: 35000,
    unit: 'one-time purchase',
    image: '🌡️',
    stock: 'Instant Download',
    certification: 'Quality Controlled Data'
  },
  {
    id: 'marine-biodiversity-report',
    category: 'reports',
    name: 'Sri Lankan Marine Biodiversity Report 2025',
    description: 'Comprehensive 200-page PDF report on marine species, habitats, and conservation status',
    price: 5000,
    unit: 'digital PDF',
    image: '📄',
    stock: 'Instant Download',
    badge: 'New'
  },
  {
    id: 'fisheries-statistics',
    category: 'reports',
    name: 'Annual Fisheries Statistical Yearbook',
    description: 'Complete fisheries data: catch statistics, vessel registrations, export data (PDF + Excel)',
    price: 8000,
    unit: 'digital download',
    image: '📊',
    stock: 'Instant Download',
    certification: 'Government Approved'
  },
  {
    id: 'gis-marine-mapping',
    category: 'software',
    name: 'NARA Marine GIS Toolkit',
    description: 'Desktop GIS software for marine spatial planning, includes 50+ map layers',
    price: 75000,
    unit: 'annual license',
    image: '🖥️',
    stock: 'Available',
    certification: 'Windows & Mac Compatible',
    badge: 'Premium'
  },
  {
    id: 'fish-id-app',
    category: 'software',
    name: 'Fish Species Identification App',
    description: 'Mobile app with AI-powered fish identification, 500+ Sri Lankan species database',
    price: 2500,
    unit: 'lifetime license',
    image: '📱',
    stock: 'Instant Download',
    badge: 'Popular'
  },
  {
    id: 'oceanography-course',
    category: 'courses',
    name: 'Introduction to Oceanography (Online)',
    description: '12-week self-paced course, video lectures, quizzes, certificate upon completion',
    price: 25000,
    unit: 'per enrollment',
    image: '🎓',
    stock: 'Enrollments Open',
    certification: 'NARA Certificate Included'
  },
  {
    id: 'marine-gis-course',
    category: 'courses',
    name: 'Marine GIS & Spatial Analysis Course',
    description: '8-week hands-on course, live webinars, project-based learning',
    price: 40000,
    unit: 'per enrollment',
    image: '🗺️',
    stock: 'Next Batch: Jan 2026',
    certification: 'Certificate Provided'
  },
  {
    id: 'ocean-data-api',
    category: 'subscriptions',
    name: 'Real-Time Ocean Data API Access',
    description: 'RESTful API for SST, salinity, currents, wave height - 10,000 requests/month',
    price: 15000,
    unit: 'per month',
    image: '🔌',
    stock: 'Available',
    badge: 'New'
  },
  {
    id: 'satellite-imagery-sub',
    category: 'subscriptions',
    name: 'Satellite Imagery Subscription',
    description: 'Weekly updated satellite images: ocean color, chlorophyll-a, sea surface height',
    price: 30000,
    unit: 'per month',
    image: '🛰️',
    stock: 'Available',
    certification: 'Sentinel-3 & MODIS Data'
  },
  {
    id: 'marine-weather-api',
    category: 'subscriptions',
    name: 'Marine Weather Forecast API',
    description: '7-day marine forecasts, wave predictions, wind data - 5,000 API calls/month',
    price: 12000,
    unit: 'per month',
    image: '🌊',
    stock: 'Available'
  },
  {
    id: 'research-database-access',
    category: 'subscriptions',
    name: 'NARA Research Database Premium Access',
    description: 'Unlimited access to 10,000+ research papers, datasets, and technical reports',
    price: 20000,
    unit: 'per year',
    image: '📚',
    stock: 'Available',
    badge: 'Premium'
  }
];

export default function NARADigitalMarketplace() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  const filteredProducts = selectedCategory === 'all'
    ? MARKETPLACE_PRODUCTS
    : MARKETPLACE_PRODUCTS.filter(p => p.category === selectedCategory);

  const addToCart = (product) => {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    setShowCart(true);
    setTimeout(() => setShowCart(false), 3000);
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-900 via-cyan-900 to-teal-900 py-16 text-white">
        <div className="absolute inset-0 opacity-10">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{ x: Math.random() * 100, y: Math.random() * 100 }}
              animate={{
                x: [null, Math.random() * 300],
                y: [null, Math.random() * 200]
              }}
              transition={{ duration: 20 + Math.random() * 10, repeat: Infinity, repeatType: 'reverse' }}
            >
              <Icons.ShoppingCart className="h-8 w-8" />
            </motion.div>
          ))}
        </div>

        <div className="relative mx-auto max-w-7xl px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="flex items-center justify-center gap-4 mb-6">
              <Icons.Store className="h-16 w-16" />
              <Icons.Download className="h-16 w-16" />
            </div>
            <h1 className="mb-6 text-center text-5xl font-bold md:text-6xl">
              NARA Digital Marketplace
            </h1>
            <p className="mx-auto mb-4 max-w-3xl text-center text-xl text-cyan-100">
              Research data, software tools, online courses & digital resources
            </p>
            <p className="mx-auto max-w-3xl text-center text-lg text-cyan-50">
              Empowering marine research through digital innovation
            </p>

            <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-6 md:grid-cols-4">
              <div className="rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-lg text-center">
                <Icons.Package className="h-8 w-8 mb-2 mx-auto" />
                <div className="text-3xl font-bold">{MARKETPLACE_PRODUCTS.length}</div>
                <div className="text-sm text-cyan-200">Products & Services</div>
              </div>
              <div className="rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-lg text-center">
                <Icons.CheckCircle className="h-8 w-8 mb-2 mx-auto" />
                <div className="text-3xl font-bold">100%</div>
                <div className="text-sm text-cyan-200">Quality Certified</div>
              </div>
              <div className="rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-lg text-center">
                <Icons.TrendingUp className="h-8 w-8 mb-2 mx-auto" />
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-sm text-cyan-200">Online Ordering</div>
              </div>
              <div className="rounded-xl border border-white/20 bg-white/10 p-6 backdrop-blur-lg text-center">
                <Icons.Shield className="h-8 w-8 mb-2 mx-auto" />
                <div className="text-3xl font-bold">Secure</div>
                <div className="text-sm text-cyan-200">Payment Gateway</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <div className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 shadow-lg backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-6 py-4">
          {PRODUCT_CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-full px-6 py-3 font-medium transition-all ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <category.icon className="h-5 w-5" />
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {showCart && cartCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-20 right-6 z-50 rounded-xl bg-green-500 p-4 text-white shadow-2xl"
        >
          <div className="flex items-center gap-3">
            <Icons.CheckCircle className="h-6 w-6" />
            <span className="font-bold">Added to cart!</span>
          </div>
        </motion.div>
      )}

      <Link
        to="/checkout"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-full bg-blue-600 px-6 py-4 text-white shadow-2xl hover:bg-blue-700 transition-all"
      >
        <Icons.ShoppingCart className="h-6 w-6" />
        <span className="font-bold">Cart ({cartCount})</span>
        {cartTotal > 0 && (
          <span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-blue-600">
            LKR {cartTotal.toLocaleString()}
          </span>
        )}
      </Link>

      <div className="mx-auto max-w-7xl px-6 py-12">
        <h2 className="mb-8 text-3xl font-bold text-gray-900">
          {PRODUCT_CATEGORIES.find(c => c.id === selectedCategory)?.name || 'All Products'}
          <span className="ml-3 text-lg text-gray-600">({filteredProducts.length} items)</span>
        </h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              whileHover={{ scale: 1.02 }}
              className="rounded-xl bg-white p-6 shadow-lg hover:shadow-xl transition-all"
            >
              {product.badge && (
                <div className="mb-3 inline-block rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 px-3 py-1 text-xs font-bold text-white">
                  {product.badge}
                </div>
              )}

              <div className="mb-4 flex h-32 items-center justify-center rounded-lg bg-gradient-to-br from-blue-50 to-cyan-50 text-6xl">
                {product.image}
              </div>

              <h3 className="mb-2 text-xl font-bold text-gray-900">{product.name}</h3>
              <p className="mb-4 text-sm text-gray-600 line-clamp-2">{product.description}</p>

              {product.certification && (
                <div className="mb-3 flex items-center gap-2 text-xs text-green-700 bg-green-50 rounded-lg p-2">
                  <Icons.BadgeCheck className="h-4 w-4" />
                  <span>{product.certification}</span>
                </div>
              )}

              <div className="mb-4 flex items-center gap-2 text-sm">
                <Icons.PackageCheck className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-600">{product.stock}</span>
              </div>

              <div className="mb-4">
                <div className="text-3xl font-bold text-blue-600">
                  LKR {product.price.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">{product.unit}</div>
              </div>

              <div className="grid gap-3 grid-cols-2">
                <button
                  onClick={() => addToCart(product)}
                  className="flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-bold text-white hover:bg-blue-700 transition-all"
                >
                  <Icons.ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </button>
                <button className="flex items-center justify-center gap-2 rounded-lg border-2 border-gray-300 px-4 py-3 font-bold text-gray-700 hover:bg-gray-50 transition-all">
                  <Icons.Info className="h-4 w-4" />
                  Details
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="border-t border-gray-200 bg-gradient-to-r from-blue-50 to-cyan-50 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">Why Choose NARA Marketplace?</h2>
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                <Icons.Award className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Quality Guaranteed</h3>
              <p className="text-gray-600">All products certified and approved by NARA experts</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <Icons.Leaf className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Sustainable Sourcing</h3>
              <p className="text-gray-600">Environmentally responsible and sustainably harvested</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100">
                <Icons.HeadphonesIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Expert Support</h3>
              <p className="text-gray-600">Direct access to NARA researchers and specialists</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
