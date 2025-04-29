import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useTheme } from '../../../themes/ThemeProvider';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';

interface WelcomeScreenProps {
  onSuggestionPress: (message: string) => void;
}

interface FeatureCardProps {
  title: string;
  description: string;
  icon: JSX.Element;
  onPress: () => void;
}

const { width } = Dimensions.get('window');
const cardWidth = width * 0.75;

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, onPress }) => {
  const { theme, themeName } = useTheme();
  
  // Higher contrast background colors for feature cards
  const cardBackgroundColor = themeName === 'dark' 
    ? 'rgba(255, 255, 255, 0.12)' // More opaque in dark mode for better visibility
    : 'rgba(0, 0, 0, 0.05)';     // Slightly darker in light mode
    
  const cardBorderColor = themeName === 'dark'
    ? 'rgba(255, 255, 255, 0.2)'  // More visible border in dark mode
    : 'rgba(0, 0, 0, 0.1)';      // Darker border in light mode
    
  // Higher contrast text colors
  const titleColor = theme.colors.textPrimary;  
  const descriptionColor = themeName === 'dark' 
    ? 'rgba(255, 255, 255, 0.9)' 
    : 'rgba(0, 0, 0, 0.8)';      // Darker description text for better readability
  
  return (
    <TouchableOpacity
      style={[
        styles.featureCard,
        { 
          backgroundColor: cardBackgroundColor,
          borderColor: cardBorderColor,
        }
      ]}
      onPress={onPress}
    >
      <View style={styles.featureIconContainer}>
        {icon}
      </View>
      <Text style={[styles.featureTitle, { color: titleColor }]}>
        {title}
      </Text>
      <Text style={[styles.featureDescription, { color: descriptionColor }]}>
        {description}
      </Text>
    </TouchableOpacity>
  );
};

interface SuggestionProps {
  text: string;
  onPress: () => void;
}

const Suggestion: React.FC<SuggestionProps> = ({ text, onPress }) => {
  const { theme, themeName } = useTheme();
  
  // Higher contrast colors for suggestion buttons
  const suggestionBackgroundColor = themeName === 'dark' 
    ? 'rgba(255, 255, 255, 0.12)' 
    : 'rgba(0, 0, 0, 0.05)';
    
  const suggestionTextColor = themeName === 'dark'
    ? 'rgba(255, 255, 255, 0.95)'
    : 'rgba(0, 0, 0, 0.85)';
  
  return (
    <TouchableOpacity
      style={[
        styles.suggestionButton, 
        { 
          borderColor: theme.colors.border,
          backgroundColor: suggestionBackgroundColor,
        }
      ]}
      onPress={onPress}
    >
      <Text style={[styles.suggestionText, { color: suggestionTextColor }]}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const ModernWelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSuggestionPress }) => {
  const { theme, themeName } = useTheme();
  
  // Define high contrast colors for the header section
  const headerSubtitleColor = 'rgba(255, 255, 255, 0.9)'; // Higher contrast subtitle text
  
  // Use higher contrast icons
  const iconColor = themeName === 'dark' ? '#A5D6A7' : '#2E7D32'; // Darker green in light mode
  
  // Improved section title color
  const sectionTitleColor = themeName === 'dark' 
    ? 'rgba(255, 255, 255, 0.95)' 
    : 'rgba(0, 0, 0, 0.85)';

  const features = [
    {
      title: "Halal Ingredient Checker",
      description: "Verify if ingredients or products comply with halal dietary requirements",
      icon: <MaterialCommunityIcons name="food" size={24} color={iconColor} />,
      onPress: () => onSuggestionPress("What ingredients should I avoid in food products?")
    },
    {
      title: "Restaurant Finder",
      description: "Discover halal-certified restaurants in your area",
      icon: <FontAwesome5 name="utensils" size={24} color={iconColor} />,
      onPress: () => onSuggestionPress("How can I find halal restaurants near me?")
    },
    {
      title: "Product Scanner",
      description: "Scan barcodes to check if products are halal certified",
      icon: <Ionicons name="barcode-outline" size={24} color={iconColor} />,
      onPress: () => onSuggestionPress("How do I use the barcode scanner to check products?")
    }
  ];

  const suggestions = [
    "Is E471 halal?",
    "What's the difference between halal and kosher?",
    "Are there halal alternatives to gelatin?",
    "How can I verify a halal certification?"
  ];

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View 
        style={[
          styles.header,
          { backgroundColor: theme.colors.primary }
        ]}
      >
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Ionicons name="chatbubble-ellipses" size={40} color="#fff" />
          </View>
        </View>
        
        <Text style={styles.headerTitle}>
          Halal Life Assistant
        </Text>
        
        <Text style={[styles.headerSubtitle, { color: headerSubtitleColor }]}>
          Your AI guide to halal living
        </Text>
      </View>

      <View style={styles.featuresSection}>
        <Text style={[styles.sectionTitle, { color: sectionTitleColor }]}>
          What I can help you with
        </Text>
        
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuresContainer}
          decelerationRate="fast"
          snapToInterval={cardWidth + 16}
          snapToAlignment="center"
        >
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              onPress={feature.onPress}
            />
          ))}
        </ScrollView>
      </View>

      <View style={styles.suggestionsSection}>
        <Text style={[styles.sectionTitle, { color: sectionTitleColor }]}>
          Try asking me
        </Text>
        
        <View style={styles.suggestionsContainer}>
          {suggestions.map((suggestion, index) => (
            <Suggestion
              key={index}
              text={suggestion}
              onPress={() => onSuggestionPress(suggestion)}
            />
          ))}
        </View>
      </View>

      <View style={styles.startChatSection}>
        <TouchableOpacity
          style={[
            styles.startChatButton, 
            { 
              backgroundColor: theme.colors.primary,
              // Add shadow for better button visibility
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 4,
              elevation: 4,
            }
          ]}
          onPress={() => onSuggestionPress("Hello! I'd like to learn more about halal guidelines.")}
        >
          <Text style={[styles.startChatText, { fontWeight: '700' }]}>Start Chatting</Text>
          <Ionicons name="arrow-forward" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  header: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  logoContainer: {
    marginBottom: 16,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  featuresSection: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  featuresContainer: {
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  featureCard: {
    width: cardWidth,
    marginHorizontal: 8,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  featureIconContainer: {
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  featureDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  suggestionsSection: {
    marginTop: 32,
    paddingHorizontal: 16,
  },
  suggestionsContainer: {
    marginHorizontal: 8,
  },
  suggestionButton: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  suggestionText: {
    fontSize: 15,
  },
  startChatSection: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  startChatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
  },
  startChatText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
});

export default ModernWelcomeScreen;