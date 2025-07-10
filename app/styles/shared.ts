import { StyleSheet } from 'react-native';

export const sharedStyles = StyleSheet.create({
  // Base Container Styles
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  scrollContent: {
    padding: 16,
  },

  // Common Text Styles
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
  },
  description: {
    fontSize: 14,
    color: '#64748b',
  },

  // Common Shadow
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});