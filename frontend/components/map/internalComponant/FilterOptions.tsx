import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Pressable,
  ScrollView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface FilterOptionsProps {
  visible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterOptions) => void;
  currentFilters: FilterOptions;
}

export interface FilterOptions {
  halalStatus: ('fully_halal' | 'partially_halal' | 'seafood')[];
  rating: number | null;
  priceLevel: number | null;
}

const FilterOptions: React.FC<FilterOptionsProps> = ({
  visible,
  onClose,
  onApplyFilters,
  currentFilters,
}) => {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(currentFilters);

  const toggleHalalStatus = (status: 'fully_halal' | 'partially_halal' | 'seafood') => {
    const newStatuses = [...localFilters.halalStatus];
    const index = newStatuses.indexOf(status);
    
    if (index > -1) {
      newStatuses.splice(index, 1);
    } else {
      newStatuses.push(status);
    }
    
    setLocalFilters({
      ...localFilters,
      halalStatus: newStatuses,
    });
  };

  const setRating = (rating: number | null) => {
    setLocalFilters({
      ...localFilters,
      rating,
    });
  };

  const setPriceLevel = (level: number | null) => {
    setLocalFilters({
      ...localFilters,
      priceLevel: level,
    });
  };

  const applyFilters = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  const resetFilters = () => {
    const resetFilters = {
      halalStatus: ['fully_halal', 'partially_halal', 'seafood'],
      rating: null,
      priceLevel: null,
    };
    setLocalFilters(resetFilters);
    onApplyFilters(resetFilters);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={styles.filterPanel} onPress={e => e.stopPropagation()}>
          <View style={styles.handleContainer}>
            <View style={styles.handle} />
          </View>
          
          <Text style={styles.filterTitle}>Filter Restaurants</Text>
          
          <ScrollView style={styles.filtersContainer}>
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Halal Status</Text>
              <View style={styles.optionsRow}>
                <TouchableOpacity 
                  style={[
                    styles.filterOption, 
                    localFilters.halalStatus.includes('fully_halal') && styles.selectedOption
                  ]}
                  onPress={() => toggleHalalStatus('fully_halal')}
                >
                  <MaterialIcons 
                    name="check-circle" 
                    size={18} 
                    color={localFilters.halalStatus.includes('fully_halal') ? 'white' : '#4CAF50'} 
                  />
                  <Text 
                    style={[
                      styles.optionText, 
                      localFilters.halalStatus.includes('fully_halal') && styles.selectedOptionText
                    ]}
                  >
                    Fully Halal
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.filterOption, 
                    localFilters.halalStatus.includes('partially_halal') && styles.selectedOption
                  ]}
                  onPress={() => toggleHalalStatus('partially_halal')}
                >
                  <MaterialIcons 
                    name="warning" 
                    size={18} 
                    color={localFilters.halalStatus.includes('partially_halal') ? 'white' : '#FF9800'} 
                  />
                  <Text 
                    style={[
                      styles.optionText, 
                      localFilters.halalStatus.includes('partially_halal') && styles.selectedOptionText
                    ]}
                  >
                    Partially Halal
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.filterOption, 
                    localFilters.halalStatus.includes('seafood') && styles.selectedOption
                  ]}
                  onPress={() => toggleHalalStatus('seafood')}
                >
                  <MaterialIcons 
                    name="water" 
                    size={18} 
                    color={localFilters.halalStatus.includes('seafood') ? 'white' : '#2196F3'} 
                  />
                  <Text 
                    style={[
                      styles.optionText, 
                      localFilters.halalStatus.includes('seafood') && styles.selectedOptionText
                    ]}
                  >
                    Seafood
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Minimum Rating</Text>
              <View style={styles.optionsRow}>
                {[null, 3, 3.5, 4, 4.5].map(rating => (
                  <TouchableOpacity 
                    key={rating === null ? 'any' : rating.toString()}
                    style={[
                      styles.ratingOption, 
                      localFilters.rating === rating && styles.selectedOption
                    ]}
                    onPress={() => setRating(rating)}
                  >
                    <Text 
                      style={[
                        styles.optionText, 
                        localFilters.rating === rating && styles.selectedOptionText
                      ]}
                    >
                      {rating === null ? 'Any' : rating.toString()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.filterSection}>
              <Text style={styles.sectionTitle}>Price Level</Text>
              <View style={styles.optionsRow}>
                <TouchableOpacity 
                  style={[
                    styles.priceOption, 
                    localFilters.priceLevel === null && styles.selectedOption
                  ]}
                  onPress={() => setPriceLevel(null)}
                >
                  <Text 
                    style={[
                      styles.optionText, 
                      localFilters.priceLevel === null && styles.selectedOptionText
                    ]}
                  >
                    Any
                  </Text>
                </TouchableOpacity>
                
                {[1, 2, 3, 4].map(level => (
                  <TouchableOpacity 
                    key={level.toString()}
                    style={[
                      styles.priceOption, 
                      localFilters.priceLevel === level && styles.selectedOption
                    ]}
                    onPress={() => setPriceLevel(level)}
                  >
                    <Text 
                      style={[
                        styles.optionText, 
                        localFilters.priceLevel === level && styles.selectedOptionText
                      ]}
                    >
                      {'$'.repeat(level)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
          
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={styles.resetButton} 
              onPress={resetFilters}
            >
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.applyButton} 
              onPress={applyFilters}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  filterPanel: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingTop: 10,
    maxHeight: '70%',
  },
  handleContainer: {
    alignItems: 'center',
    paddingBottom: 10,
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#E0E0E0',
    marginBottom: 10,
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  filtersContainer: {
    marginBottom: 15,
  },
  filterSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -5,
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  ratingOption: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    alignItems: 'center',
    minWidth: 50,
  },
  priceOption: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    alignItems: 'center',
    minWidth: 50,
  },
  selectedOption: {
    backgroundColor: '#2c3e50',
  },
  optionText: {
    fontSize: 14,
    marginLeft: 5,
    color: '#333',
  },
  selectedOptionText: {
    color: 'white',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  resetButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    width: '30%',
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#555',
  },
  applyButton: {
    backgroundColor: '#2c3e50',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: '65%',
    alignItems: 'center',
  },
  applyButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default FilterOptions; 