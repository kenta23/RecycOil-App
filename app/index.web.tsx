import { View, Text, Pressable, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router'
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';


type Step = {
  title: string;
  description: string;
  status: 'completed' | 'current' | 'upcoming';
};


export default function home() {
  const router = useRouter();

  const [steps] = useState<Step[]>([
    {
      title: 'Project Details',
      description: 'Enter your project information and requirements',
      status: 'completed',
    },
    {
      title: 'Team Selection',
      description: 'Choose team members and assign roles',
      status: 'current',
    },
    {
      title: 'Review & Timeline',
      description: 'Set project timeline and milestones',
      status: 'upcoming',
    },
    {
      title: 'Final Confirmation',
      description: 'Confirm all details and launch project',
      status: 'upcoming',
    },
  ]);

  return (
    <View>
      <Text>home</Text>
      <View style={styles.stepsContainer}>
          {steps.map((step, index) => (
            <View key={step.title} style={styles.stepWrapper}>
              {/* Connector Line */}
              {index !== steps.length - 1 && (
                <View
                  style={[
                    styles.connector,
                    { backgroundColor: step.status === 'completed' ? '#3B82F6' : '#E5E7EB' }
                  ]}
                />
              )}
              
              {/* Step Content */}
              <View style={styles.stepContent}>
                {/* Status Icon */}
                <View style={styles.iconContainer}>
                  {step.status === 'completed' ? (
                    <View style={[styles.circle, styles.completedCircle]}>
                      <FontAwesome name="check-circle" size={24} color="#fff" />
                    </View>
                  ) : step.status === 'current' ? (
                    <View style={[styles.circle, styles.currentCircle]}>
                      <FontAwesome5 name="dot-circle" size={24} color="#3B82F6" />
                   
                    </View>
                  ) : (
                    <View style={[styles.circle, styles.upcomingCircle]}>
                      <View style={styles.dot} />
                    </View>
                  )}
                </View>
                
                {/* Step Details */}
                <View style={styles.textContainer}>
                  <Text style={[
                    styles.stepTitle,
                    step.status === 'completed' && styles.completedTitle,
                    step.status === 'current' && styles.currentTitle,
                    step.status === 'upcoming' && styles.upcomingTitle,
                  ]}>
                    {step.title}
                  </Text>
                  <Text style={styles.description}>{step.description}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 32,
  },
  stepsContainer: {
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  stepWrapper: {
    position: 'relative',
    marginBottom: 32,
  },
  connector: {
    position: 'absolute',
    left: 27,
    top: 56,
    width: 2,
    height: 64,
  },
  stepContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    marginRight: 24,
  },
  circle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedCircle: {
    backgroundColor: '#3B82F6',
  },
  currentCircle: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  upcomingCircle: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E5E7EB',
  },
  textContainer: {
    flex: 1,
    paddingTop: 8,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  completedTitle: {
    color: '#3B82F6',
  },
  currentTitle: {
    color: '#111827',
  },
  upcomingTitle: {
    color: '#6B7280',
  },
  description: {
    fontSize: 16,
    color: '#4B5563',
  },
});