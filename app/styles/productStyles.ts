import { StyleSheet } from 'react-native';

export const productStyles = StyleSheet.create({
  // Product Card Styles
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    overflow: 'hidden',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  imageContainer: {
    width: 120,
  },
  image: {
    width: 120,
    height: 120,
    resizeMode: 'cover',
  },
  info: {
    flex: 1,
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    flex: 1,
    marginRight: 8,
  },
  description: {
    fontSize: 14,
    color: '#64748b',
  },
  priceContainer: {
    marginTop: 8,
    marginBottom: 8,
  },
  priceNet: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2563eb',
  },
  priceGross: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },

  // Category Tag Styles
  categoryContainer: {
    padding: 8,
    backgroundColor: '#ffffff',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  categoryTag: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignItems: 'center',
  },
  categoryTagText: {
    fontSize: 12,
    color: '#64748b',
  },

  // Quantity Controls
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 4,
  },
  quantityButton: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  quantityText: {
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '600',
    marginHorizontal: 12,
  },

  // Add Button
  addButton: {
    backgroundColor: '#2563eb',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  addButtonActive: {
    backgroundColor: '#16a34a',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
});