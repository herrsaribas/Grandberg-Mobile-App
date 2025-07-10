import { StyleSheet } from 'react-native';

export const homeStyles = StyleSheet.create({
  // Container Styles
  container: {
    marginTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
  },

  // Banner Styles
  banner: {
    margin: 16,
    padding: 16,
    backgroundColor: '#e0f2fe',
    borderRadius: 8,
  },
  bannerText: {
    fontSize: 14,
    color: '#0369a1',
    lineHeight: 20,
    textAlign: 'center',
  },

  // Category Styles
  list: {
    paddingHorizontal: 12,
  },
  categoryCard: {
    alignItems: 'center',
    marginHorizontal: 4,
    width: 100,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    color: '#1e293b',
    textAlign: 'center',
  },

  // Products List Styles
  productsContainer: {
    marginTop: 24,
    paddingBottom: 16,
  },
  productsHeader: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  productsTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
  },
  productsList: {
    paddingHorizontal: 16,
  },
  productWrapper: {
    marginBottom: 16,
  },

  // Website Promo Styles
  websitePromo: {
    margin: 16,
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    alignItems: 'center',
  },
  promoText: {
    fontSize: 14,
    color: '#2563eb',
  },
});