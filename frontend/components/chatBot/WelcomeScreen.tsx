import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from 'themes/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';

interface WelcomeScreenProps {
  onSuggestionPress: (suggestion: string) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSuggestionPress }) => {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#1E1E1E', // Dark background to match new theme
    },
    welcomeHeader: {
      marginBottom: 32,
      alignItems: 'center',
    },
    logo: {
      width: 100,
      height: 100,
      marginBottom: 24,
      backgroundColor: '#4A56E2', // Blue color similar to design
      borderRadius: 50,
      alignItems: 'center',
      justifyContent: 'center',
    },
    welcomeTitle: {
      fontSize: 26,
      fontWeight: 'bold',
      color: '#FFFFFF', // White text for dark background
      marginBottom: 12,
      textAlign: 'center',
    },
    welcomeSubtitle: {
      fontSize: 16,
      color: '#B0B0B0', // Light gray text for dark background
      textAlign: 'center',
      paddingHorizontal: 20,
      lineHeight: 22,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#FFFFFF', // White text for dark background
      marginVertical: 16,
    },
    cardContainer: {
      marginBottom: 20,
    },
    card: {
      backgroundColor: '#2D2D2D', // Dark card background
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.1)', // Subtle border
      flexDirection: 'row',
      alignItems: 'center',
    },
    cardIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: '#4A56E2' + '30', // Blue with transparency
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    cardContent: {
      flex: 1,
    },
    cardTitle: {
      fontSize: 17,
      fontWeight: '600',
      color: '#FFFFFF', // White text for dark background
      marginBottom: 6,
    },
    cardDescription: {
      fontSize: 14,
      color: '#B0B0B0', // Light gray text for dark background
      lineHeight: 20,
    },
    iconStyle: {
      color: '#4A56E2', // Blue color similar to design
    },
  });

  const suggestedQuestions = [
    {
      title: "Is this food halal?",
      description: "Check if specific ingredients or food items are halal",
      icon: "nutrition-outline",
      message: "I want to know if this food is halal: "
    },
    {
      title: "Find halal restaurants",
      description: "Discover halal dining options near you",
      icon: "restaurant-outline",
      message: "Can you help me find halal restaurants near me?"
    },
    {
      title: "Halal ingredient check",
      description: "Learn about common food additives and ingredients",
      icon: "list-outline",
      message: "What are common non-halal ingredients I should watch out for?"
    },
    {
      title: "Understanding certifications",
      description: "Learn about different halal certifications",
      icon: "shield-checkmark-outline",
      message: "What do different halal certification symbols mean?"
    }
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40, paddingTop: 20 }}>
      <View style={styles.welcomeHeader}>
        <View style={styles.logo}>
          <Ionicons name="chatbubble-ellipses" size={60} color="#FFFFFF" />
        </View>
        <Text style={styles.welcomeTitle}>HalalLife Assistant</Text>
        <Text style={styles.welcomeSubtitle}>
          I can help you with questions about halal food, ingredients, and finding halal options. What would you like to know?
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Popular Questions</Text>
      <View style={styles.cardContainer}>
        {suggestedQuestions.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.card}
            onPress={() => onSuggestionPress(item.message)}
          >
            <View style={styles.cardIcon}>
              <Ionicons name={item.icon as any} size={28} color="#4A56E2" />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDescription}>{item.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default WelcomeScreen;