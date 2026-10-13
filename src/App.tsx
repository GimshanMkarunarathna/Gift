import React, { useState, useEffect, useMemo } from 'react';
import { PRODUCTS as INITIAL_PRODUCTS } from './data/mockData';
import { Product, CartItem, PersonalizationData } from './types';
import { api, User } from './services/api';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CurationPathways } from './components/CurationPathways';
import { CategoryGrid } from './components/CategoryGrid';
import { ProductGrid } from './components/ProductGrid';
import { PersonalizationAtelier } from './components/PersonalizationAtelier';
import { OccasionGrid } from './components/OccasionGrid';
import { SmartGiftFinder } from './components/SmartGiftFinder';
import { TrustBenefits } from './components/TrustBenefits';
import { Testimonials } from './components/Testimonials';
import { VisualAnthology } from './components/VisualAnthology';
import { Newsletter } from './components/Newsletter';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { SearchModal } from './components/SearchModal';
import { ProductModal } from './components/ProductModal';
import { PersonalizationModal } from './components/PersonalizationModal';
import { TrackOrderModal } from './components/TrackOrderModal';
import { ConciergeModal } from './components/ConciergeModal';
import { AccountModal } from './components/AccountModal';
import { CheckoutModal } from './components/CheckoutModal';
import { Toast } from './components/Toast';
import { AdminPortal } from './components/admin/AdminPortal';
import { AdminLogin } from './components/admin/AdminLogin';
import { ClientAuthModal } from './components/ClientAuthModal';
import { AnimatedLoadingScreen } from './components/brand/AnimatedLoadingScreen';
import { GifyStudioHub } from './components/studio/GifyStudioHub';

export default function App() {
  // Brand & View States
  const [isLoadingScreenOpen, setIsLoadingScreenOpen] = useState<boolean>(true);
  const [isStudioActive, setIsStudioActive] = useState<boolean>(false);

  // Authentication & Admin State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdminPortalActive, setIsAdminPortalActive] = useState<boolean>(false);
  const [isAdminLoginModalOpen, setIsAdminLoginModalOpen] = useState<boolean>(false);
  const [isClientAuthModalOpen, setIsClientAuthModalOpen] = useState<boolean>(false);
  const [clientAuthInitialMode, setClientAuthInitialMode] = useState<'signin' | 'signup'>('signin');

  // Live Database Products State
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);

  // Navigation & Filtering State
  const [activePathway, setActivePathway] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedOccasion, setSelectedOccasion] = useState<string>('all');

  // E-commerce State
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 'cart-init-1',
      product: INITIAL_PRODUCTS[0], // Good Vibes Gift Box as initial item
      quantity: 1,
      personalization: {
        recipientName: 'Ruwini',
        message: 'Wishing you sheer peace and joy on your graduation day.',
        waxSealColor: 'Signature Burgundy',
      },
    },
  ]);

  const [wishlistIds, setWishlistIds] = useState<string[]>([
    'prod-1',
    'prod-2',
  ]);

  // Modals Visibility State
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);
  const [isConciergeOpen, setIsConciergeOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isPersonalizationOpen, setIsPersonalizationOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProductForQuickView, setSelectedProductForQuickView] =
    useState<Product | null>(null);

  // Global Personalization Keepsake State
  const [globalPersonalization, setGlobalPersonalization] =
    useState<PersonalizationData | null>(null);

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current));
    }, 3200);
  };

  // Global Brand & Theme Settings
  const [brandSettings, setBrandSettings] = useState<any>(null);

  // Restore session & fetch live database products and brand configuration on mount
  useEffect(() => {
    checkCurrentUser();
    loadLiveProducts();
    loadBrandSettings();
  }, []);

  const loadBrandSettings = async () => {
    try {
      const res = await api.brandSettings.get();
      if (res.settings) {
        setBrandSettings(res.settings);
      }
    } catch {
      // offline fallback
    }
  };

  const checkCurrentUser = async () => {
    try {
      const res = await api.auth.getMe();
      if (res.user) {
        setCurrentUser(res.user);
        return;
      }
    } catch {
      // Offline / guest mode
    }
    const savedClient = localStorage.getItem('giftora_client_user');
    if (savedClient) {
      try {
        setCurrentUser(JSON.parse(savedClient));
      } catch {}
    }
  };

  const loadLiveProducts = async () => {
    try {
      const res = await api.products.getAll();
      if (res.products && res.products.length > 0) {
        const mapped: Product[] = res.products.map((p: any) => ({
          id: p.id,
          title: p.name,
          subtitle: p.subtitle || 'Handcrafted keepsake',
          description: p.description,
          price: p.price,
          formattedPrice: `LKR ${p.price.toLocaleString()}`,
          rating: p.rating || 5.0,
          reviewCount: p.reviewCount || 0,
          badge: p.isBestSeller ? 'Best Seller' : p.isFeatured ? 'Featured' : undefined,
          badgeType: 'primary',
          featureTag: p.tags?.[0] || 'Free Wrapping',
          image: p.image,
          imageAlt: p.name,
          category: p.category,
          occasion: p.occasion || [],
          vibe: ['Personalized'],
          isPersonalizable: p.isPersonalizable,
        }));
        setProducts(mapped);
      }
    } catch (err) {
      console.warn('Using local fallback products', err);
    }
  };

  // Keyboard shortcut ⌘K / Ctrl+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filtered Products Calculation
  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // Pathway filter
      if (activePathway !== 'all') {
        if (activePathway === 'budget' && item.price > 2500) return false;
        if (activePathway === 'personalized' && !item.isPersonalizable) return false;
        if (
          activePathway !== 'budget' &&
          activePathway !== 'personalized' &&
          !item.occasion.includes(activePathway)
        ) {
          return false;
        }
      }

      // Category filter
      if (selectedCategory !== 'all') {
        if (selectedCategory === 'birthday' && !item.occasion.includes('birthday')) {
          return false;
        }
        if (selectedCategory === 'anniversary' && !item.occasion.includes('anniversary')) {
          return false;
        }
        if (selectedCategory === 'wedding' && !item.occasion.includes('wedding')) {
          return false;
        }
        if (
          !['birthday', 'anniversary', 'wedding'].includes(selectedCategory) &&
          item.category !== selectedCategory
        ) {
          return false;
        }
      }

      // Occasion filter
      if (selectedOccasion !== 'all' && !item.occasion.includes(selectedOccasion)) {
        return false;
      }

      return true;
    });
  }, [products, activePathway, selectedCategory, selectedOccasion]);

  // Cart Handlers
  const handleAddToCart = (
    product: Product,
    quantity = 1,
    personalization?: { recipientName: string; message: string; waxSealColor: string }
  ) => {
    setCartItems((prev) => {
      const existing = prev.find(
        (i) =>
          i.product.id === product.id &&
          i.personalization?.recipientName === personalization?.recipientName
      );
      if (existing) {
        return prev.map((i) =>
          i.id === existing.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [
        ...prev,
        {
          id: `cart-${Date.now()}-${Math.random()}`,
          product,
          quantity,
          personalization:
            personalization ||
            (globalPersonalization
              ? {
                  recipientName: globalPersonalization.recipientName,
                  message: globalPersonalization.message,
                  waxSealColor: globalPersonalization.waxSealColor,
                }
              : undefined),
        },
      ];
    });

    showToast(`Added ${product.title} (${product.formattedPrice}) to your gift bag`);
  };

  const handleUpdateCartQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((i) => {
          if (i.id === id) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
    showToast('Item removed from your gift bag');
  };

  // Wishlist Handlers
  const handleToggleWishlist = (product: Product) => {
    setWishlistIds((prev) => {
      if (prev.includes(product.id)) {
        showToast(`Removed ${product.title} from Wishlist`);
        return prev.filter((id) => id !== product.id);
      } else {
        showToast(`Saved ${product.title} to your curated wishlist`);
        return [...prev, product.id];
      }
    });
  };

  const wishlistProducts = useMemo(() => {
    return products.filter((p) => wishlistIds.includes(p.id));
  }, [products, wishlistIds]);

  // Finder Handler
  const handleCompleteFinder = (answers: {
    recipient: string;
    occasion: string;
    budget: string;
    vibe: string;
  }) => {
    showToast(
      `Found 18 thoughtful gifts tailored for your ${answers.recipient} (${answers.occasion})!`
    );
    if (answers.occasion.toLowerCase() === 'birthday') {
      setActivePathway('birthday');
    } else if (answers.occasion.toLowerCase() === 'anniversary') {
      setActivePathway('anniversary');
    } else {
      setActivePathway('all');
    }
    const el = document.getElementById('products-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleResetFilters = () => {
    setActivePathway('all');
    setSelectedCategory('all');
    setSelectedOccasion('all');
    showToast('Showing all handcrafted gifts');
  };

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  // Admin Portal Trigger
  const handleOpenAdmin = () => {
    if (currentUser?.role === 'admin' || currentUser?.role === 'staff') {
      setIsAdminPortalActive(true);
    } else {
      setIsAdminLoginModalOpen(true);
    }
  };

  const handleAdminLoginSuccess = (user: User) => {
    setCurrentUser(user);
    setIsAdminLoginModalOpen(false);
    setIsAdminPortalActive(true);
    showToast(`Welcome, ${user.name}. Administrator session authorized.`);
  };

  const handleLogout = async () => {
    try {
      await api.auth.logout();
    } catch {}
    localStorage.removeItem('giftora_client_user');
    setCurrentUser(null);
    setIsAdminPortalActive(false);
    showToast('You have been signed out successfully.');
  };

  const totalCartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);

  // If Admin Portal is active, render full-screen Admin Portal view!
  if (isAdminPortalActive && currentUser && (currentUser.role === 'admin' || currentUser.role === 'staff')) {
    return (
      <>
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
        <AdminPortal
          currentUser={currentUser}
          onLogout={handleLogout}
          onReturnToStorefront={() => {
            setIsAdminPortalActive(false);
            loadLiveProducts(); // Refetch live updates when returning to storefront
            loadBrandSettings(); // Refetch brand/theme settings
          }}
          onShowToast={showToast}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#2B2D2F] flex flex-col antialiased selection:bg-[#EAF5EC] selection:text-[#2D6A4F]">
      {/* Toast Notification */}
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* Primary Sticky Header */}
      <Header
        cartCount={totalCartCount}
        wishlistCount={wishlistIds.length}
        currentUser={currentUser}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
        onOpenConcierge={() => setIsConciergeOpen(true)}
        onOpenAccount={() => setIsAccountOpen(true)}
        onOpenAdmin={handleOpenAdmin}
        onOpenAuthModal={(mode) => {
          setClientAuthInitialMode(mode || 'signin');
          setIsClientAuthModalOpen(true);
        }}
        onLogout={handleLogout}
        isAdminLoggedIn={currentUser?.role === 'admin'}
        onOpenStudio={() => setIsStudioActive((prev) => !prev)}
        onOpenLoadingDemo={() => setIsLoadingScreenOpen(true)}
        isStudioActive={isStudioActive}
        announcementText={brandSettings?.announcementActive ? brandSettings?.announcementText : undefined}
        onSelectCategory={(cat) => {
          if (isStudioActive) {
            setIsStudioActive(false);
          }
          setSelectedCategory(cat);
          if (cat !== 'all') {
            scrollToSection('products-section');
          }
        }}
        currentCategory={selectedCategory}
      />

      {/* Main Content Area */}
      <main className="w-full pt-20 md:pt-28 flex-1">
        {isStudioActive ? (
          <GifyStudioHub
            onAddToCart={(p) => {
              handleAddToCart(
                {
                  id: p.id,
                  title: p.name,
                  subtitle: p.category,
                  price: p.price,
                  image: p.image,
                  imageAlt: p.name,
                  category: p.category,
                  formattedPrice: `LKR ${p.price.toLocaleString()}`,
                  rating: 5.0,
                  reviewCount: 32,
                  isPersonalizable: true,
                  description: p.description,
                  occasion: ['Everyday'],
                } as any,
                1
              );
            }}
            onOpenProductModal={(p) => {
              setSelectedProductForQuickView({
                id: p.id,
                title: p.name,
                subtitle: p.category,
                price: p.price,
                image: p.image,
                imageAlt: p.name,
                category: p.category,
                formattedPrice: `LKR ${p.price.toLocaleString()}`,
                rating: 5.0,
                reviewCount: 32,
                isPersonalizable: true,
                description: p.description,
                occasion: ['Everyday'],
              } as any);
            }}
            onShowToast={showToast}
            onOpenLoadingDemo={() => setIsLoadingScreenOpen(true)}
            onReturnToStorefront={() => setIsStudioActive(false)}
            onOpenAdmin={handleOpenAdmin}
          />
        ) : (
          <>
            {/* SECTION 1: HERO */}
            <Hero
              onShopGifts={() => scrollToSection('gift-discovery')}
              onDiscoverGift={() => scrollToSection('smart-gift-finder')}
              onOpenAtelier={() => setIsPersonalizationOpen(true)}
            />

            {/* SECTION 2: CURATION PATHWAYS */}
            <CurationPathways
              activePathway={activePathway}
              onSelectPathway={(p) => {
                setActivePathway(p);
                scrollToSection('products-section');
              }}
              onHelpMeChoose={() => scrollToSection('smart-gift-finder')}
            />

            {/* SECTION 3: SHOP BY CURATED CATEGORY */}
            <CategoryGrid
              selectedCategory={selectedCategory}
              onSelectCategory={(cat) => {
                setSelectedCategory(cat);
                scrollToSection('products-section');
              }}
            />

            {/* SECTION 4: MOST TREASURED PRODUCT GRID */}
            <ProductGrid
              products={filteredProducts}
              wishlistIds={wishlistIds}
              onToggleWishlist={handleToggleWishlist}
              onAddToCart={(p) => handleAddToCart(p, 1)}
              onQuickView={(p) => setSelectedProductForQuickView(p)}
              onResetFilters={handleResetFilters}
            />

            {/* SECTION 5: SIGNATURE PERSONALIZATION ATELIER */}
            <PersonalizationAtelier
              onOpenModal={() => setIsPersonalizationOpen(true)}
              savedPersonalization={globalPersonalization}
            />

            {/* SECTION 6: SHOP BY OCCASION */}
            <OccasionGrid
              onSelectOccasion={(occ) => {
                setSelectedOccasion(occ);
                scrollToSection('products-section');
              }}
            />

            {/* SECTION 7: SMART GIFT FINDER CONCIERGE */}
            <SmartGiftFinder onCompleteFinder={handleCompleteFinder} />

            {/* SECTION 8: TRUST AND SERVICE BENEFITS */}
            <TrustBenefits
              onOpenConcierge={() => setIsConciergeOpen(true)}
              onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
            />

            {/* SECTION 9: TESTIMONIALS / WORDS FROM RECIPIENTS */}
            <Testimonials />

            {/* SECTION 10: VISUAL ANTHOLOGY (INSTAGRAM GALLERY) */}
            <VisualAnthology onShowToast={showToast} />

            {/* SECTION 11: NEWSLETTER (THE GIFTORA JOURNAL) */}
            <Newsletter onShowToast={showToast} />
          </>
        )}
      </main>

      {/* FOOTER */}
      <Footer
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          scrollToSection('products-section');
        }}
        onSelectOccasion={(occ) => {
          setSelectedOccasion(occ);
          scrollToSection('products-section');
        }}
        onOpenTrackOrder={() => setIsTrackOrderOpen(true)}
        onOpenConcierge={() => setIsConciergeOpen(true)}
        onOpenAdmin={handleOpenAdmin}
        onShowToast={showToast}
      />

      {/* DRAWERS & MODALS */}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={(total, promo) => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistProducts={wishlistProducts}
        onAddToCart={(p) => handleAddToCart(p, 1)}
        onRemoveFromWishlist={handleToggleWishlist}
      />

      {/* Quick Search Modal (⌘K) */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onSelectProduct={(p) => setSelectedProductForQuickView(p)}
      />

      {/* Product Quick View & Personalization Modal */}
      <ProductModal
        product={selectedProductForQuickView}
        isOpen={!!selectedProductForQuickView}
        onClose={() => setSelectedProductForQuickView(null)}
        onAddToCart={handleAddToCart}
        isWishlisted={
          selectedProductForQuickView
            ? wishlistIds.includes(selectedProductForQuickView.id)
            : false
        }
        onToggleWishlist={handleToggleWishlist}
      />

      {/* Inscribe Keepsake Atelier Modal */}
      <PersonalizationModal
        isOpen={isPersonalizationOpen}
        onClose={() => setIsPersonalizationOpen(false)}
        initialData={globalPersonalization}
        onSave={(data) => {
          setGlobalPersonalization(data);
          showToast(`Stationery personalization for "${data.recipientName}" saved!`);
        }}
      />

      {/* Track Order Modal */}
      <TrackOrderModal
        isOpen={isTrackOrderOpen}
        onClose={() => setIsTrackOrderOpen(false)}
      />

      {/* Concierge Care Modal */}
      <ConciergeModal
        isOpen={isConciergeOpen}
        onClose={() => setIsConciergeOpen(false)}
        onShowToast={showToast}
      />

      {/* User Account / Keepsakes Modal */}
      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenTrackOrder={() => {
          setIsAccountOpen(false);
          setIsTrackOrderOpen(true);
        }}
        onOpenStudio={() => {
          setIsAccountOpen(false);
          setIsStudioActive(true);
        }}
        onOpenAuthModal={() => {
          setIsAccountOpen(false);
          setIsClientAuthModalOpen(true);
        }}
      />

      {/* Client Sign In & Register Modal */}
      <ClientAuthModal
        isOpen={isClientAuthModalOpen}
        onClose={() => setIsClientAuthModalOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          localStorage.setItem('giftora_client_user', JSON.stringify(user));
        }}
        onShowToast={showToast}
        initialMode={clientAuthInitialMode}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        totalAmount={cartItems.reduce(
          (acc, item) => acc + item.product.price * item.quantity,
          0
        )}
        onOrderCompleted={(order) => {
          setCartItems([]);
          showToast(`Order ${order.orderNumber} confirmed! Our artisans have begun packaging.`);
          loadLiveProducts(); // Refetch inventory after order placed
        }}
      />

      {/* Admin Login Security Modal */}
      {isAdminLoginModalOpen && (
        <AdminLogin
          onSuccess={handleAdminLoginSuccess}
          onCancel={() => setIsAdminLoginModalOpen(false)}
        />
      )}

      {/* STEP 3: Animated Lily Bloom Loading Screen Experience */}
      <AnimatedLoadingScreen
        isOpen={isLoadingScreenOpen}
        onClose={() => setIsLoadingScreenOpen(false)}
        autoCloseMs={brandSettings?.loadingBloomSpeed || 2800}
      />
    </div>
  );
}
