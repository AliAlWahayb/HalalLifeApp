import { View, Text } from 'react-native';
import React, { useMemo } from 'react';
import Accordion from 'components/Shared/Accordion';
import { extractNovaGroup, formatTag, getDietaryWarnings } from 'util/productDataFormatters';

// Helper component for details row
const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <View className="flex-row justify-between py-1">
    <Text className="font-bold text-textPrimary">{label}:</Text>
    <View className="ml-2 flex-1 items-end">
      {typeof value === 'string' ? (
        <Text className="text-right text-textPrimary">{value}</Text>
      ) : (
        value
      )}
    </View>
  </View>
);

const Details = ({ product }: { product: any }) => {
  const nutriscore_grade_Color = useMemo(() => {
    if (product.nutriscore_grade.toUpperCase() === 'A') return 'bg-green-700';
    if (product.nutriscore_grade.toUpperCase() === 'B') return 'bg-green-300';
    if (product.nutriscore_grade.toUpperCase() === 'C') return 'bg-yellow-500';
    if (product.nutriscore_grade.toUpperCase() === 'D') return 'bg-orange-500';
    if (product.nutriscore_grade.toUpperCase() === 'E') return 'bg-red-500';
    return 'text-gray-500';
  }, [product.nutriscore_grade]);

  const novaGroup_Color = useMemo(() => {
    const novaGroup = extractNovaGroup(product.nova_groups_tags[0]);
    if (novaGroup === '4') return 'bg-red-500';
    if (novaGroup === '3') return 'bg-orange-500';
    if (novaGroup === '2') return 'bg-yellow-500';
    if (novaGroup === '1') return 'bg-green-500';
    return 'bg-gray-500';
  }, [product.nova_groups_tags]);

  // Format allergens for display
  const allergens = useMemo(() => {
    if (!product.allergens_hierarchy?.length) return 'None';
    return product.allergens_hierarchy.map(formatTag).join(', ');
  }, [product.allergens_hierarchy]);

  // Format labels for display
  const labels = useMemo(() => {
    if (!product.labels_tags?.length) return 'None';
    return product.labels_tags.map(formatTag).join(', ');
  }, [product.labels_tags]);

  // Get dietary warnings
  const { veganWarning, vegetarianWarning, palmOilWarning } = useMemo(() => {
    return getDietaryWarnings(product.ingredients_analysis_tags || []);
  }, [product.ingredients_analysis_tags]);

  // Get Nova group
  const novaGroup = useMemo(() => {
    if (!product.nova_groups_tags?.length) return 'N/A';
    return extractNovaGroup(product.nova_groups_tags[0]);
  }, [product.nova_groups_tags]);
  return (
    <>
      {/* Details Accordion */}
      <Accordion key="details" title="Details">
        <View className="">
          {product.generic_name && <DetailRow label="Generic Name" value={product.generic_name} />}
          {product.brands && <DetailRow label="Brand" value={product.brands} />}
          {product.quantity && <DetailRow label="Quantity" value={product.quantity} />}
          {allergens && <DetailRow label="Allergens" value={allergens} />}
          {labels && <DetailRow label="Labels" value={labels} />}
          {product.origins && <DetailRow label="Origin" value={product.origins} />}
          {product.countries && <DetailRow label="Sold in" value={product.countries} />}
          {product.nutriscore_grade && product.nutriscore_grade !== 'not-applicable' && (
            <DetailRow
              label="Nutri-Score"
              value={
                <View className={`rounded-full ${nutriscore_grade_Color} px-2 py-1`}>
                  <Text className="font-bold uppercase text-textSecondary">
                    {product.nutriscore_grade || 'N/A'}
                  </Text>
                </View>
              }
            />
          )}
          {novaGroup && (
            <DetailRow
              label="Nova-Score"
              value={
                <View className={`rounded-full ${novaGroup_Color} px-2 py-1`}>
                  <Text className="font-bold uppercase text-textSecondary">
                    {novaGroup || 'N/A'}
                  </Text>
                </View>
              }
            />
          )}

          {/* Warning badges */}
          <View className="mt-1">
            {veganWarning && (
              <View className=" rounded-xl bg-yellow-100 px-3 py-1">
                <Text className="text-yellow-800">
                  Warning: Vegan status could not be verified for all ingredients
                </Text>
              </View>
            )}

            {vegetarianWarning && (
              <View className=" rounded-xl bg-yellow-100 px-3 py-1">
                <Text className="text-yellow-800">
                  Warning: Vegetarian status could not be verified for all ingredients
                </Text>
              </View>
            )}
          </View>
        </View>
      </Accordion>
    </>
  );
};

export default Details;
