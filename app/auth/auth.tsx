import { router } from 'expo-router';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { Eye, EyeOff, Mail, Phone, User } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { Colors } from '../../constants/Colors';
import { FIREBASE_AUTH } from '../../core/firebase/config';

// Get screen dimensions for responsive design
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface FormData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const validateForm = (): boolean => {
    if (!isLogin) {
      // Registration validation
      if (formData.password !== formData.confirmPassword) {
        Alert.alert('Error', 'Passwords do not match.');
        return false;
      }
      if (!formData.name || !formData.email || !formData.password) {
        Alert.alert('Error', 'Please fill all required fields for registration.');
        return false;
      }
      if (formData.password.length < 6) {
        Alert.alert('Error', 'Password must be at least 6 characters long.');
        return false;
      }
    } else {
      // Login validation
      if (!formData.email || !formData.password) {
        Alert.alert('Error', 'Please fill all fields to log in.');
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (isLoading || !validateForm()) return;

    setIsLoading(true);

    try {
      if (isLogin) {
        // Login with Firebase
        await signInWithEmailAndPassword(FIREBASE_AUTH, formData.email, formData.password);
        Alert.alert('Success', 'Login successful!');
        router.replace('/customer');
      } else {
        // Register with Firebase
        await createUserWithEmailAndPassword(FIREBASE_AUTH, formData.email, formData.password);
        Alert.alert('Success', 'Registration successful!');
        router.replace('/customer');
      }
    } catch (error: any) {
      let errorMessage = 'An error occurred. Please try again.';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please use a different email or try logging in.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please choose a stronger password.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email. Please check your email or register.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password. Please try again.';
      } else if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid email or password. Please check your credentials.';
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    });
  };

  const toggleAuthMode = (loginMode: boolean) => {
    setIsLogin(loginMode);
    resetForm();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/hpgas-logo.png')}
          style={styles.logo}
        />
        <Text style={styles.title}>HP Gas Services</Text>
        <Text style={styles.subtitle}>Vihar Electricals</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[styles.toggleButton, isLogin && styles.activeToggle]}
            onPress={() => toggleAuthMode(true)}
          >
            <Text style={[styles.toggleText, isLogin && styles.activeToggleText]}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, !isLogin && styles.activeToggle]}
            onPress={() => toggleAuthMode(false)}
          >
            <Text style={[styles.toggleText, !isLogin && styles.activeToggleText]}>Register</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputContainer}>
          {!isLogin && (
            <View style={styles.inputWrapper}>
              <User size={20} color={Colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={formData.name}
                onChangeText={(text) => updateFormData('name', text)}
                placeholderTextColor={Colors.textSecondary}
              />
            </View>
          )}

          <View style={styles.inputWrapper}>
            <Mail size={20} color={Colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              value={formData.email}
              onChangeText={(text) => updateFormData('email', text)}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholderTextColor={Colors.textSecondary}
            />
          </View>

          {!isLogin && (
            <View style={styles.inputWrapper}>
              <Phone size={20} color={Colors.textSecondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Contact Phone Number"
                value={formData.phone}
                onChangeText={(text) => updateFormData('phone', text)}
                keyboardType="phone-pad"
                placeholderTextColor={Colors.textSecondary}
              />
            </View>
          )}

          <View style={styles.inputWrapper}>
            <View style={styles.passwordInputContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Password"
                value={formData.password}
                onChangeText={(text) => updateFormData('password', text)}
                secureTextEntry={!showPassword}
                placeholderTextColor={Colors.textSecondary}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} color={Colors.textSecondary} /> : <Eye size={20} color={Colors.textSecondary} />}
              </TouchableOpacity>
            </View>
          </View>

          {!isLogin && (
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChangeText={(text) => updateFormData('confirmPassword', text)}
                secureTextEntry={true}
                placeholderTextColor={Colors.textSecondary}
              />
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[styles.submitButton, isLoading && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color={Colors.white} />
          ) : (
            <Text style={styles.submitButtonText}>
              {isLogin ? 'Login' : 'Register'}
            </Text>
          )}
        </TouchableOpacity>

        {isLogin && (
          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Secure and reliable gas delivery service
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    backgroundColor: Colors.primary,
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 60,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  logo: {
    width: 85,
    height: 85,
    borderRadius: 15,
    marginTop: 26,
    marginBottom: 0,
    padding: 2,
  },
  title: {
    fontSize: 28,
    marginTop: 0,
    fontWeight: '800',
    color: Colors.white,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: Colors.white,
    opacity: 0.9,
  },
  formContainer: {
    backgroundColor: Colors.surface,
    marginHorizontal: 20,
    marginTop: -40,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 5,
    marginBottom: 24,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  activeToggle: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  activeToggleText: {
    color: Colors.white,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 14,
    paddingHorizontal: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '400',
    color: Colors.text,
    paddingVertical: 16,
  },
  passwordInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '400',
    color: Colors.text,
    paddingVertical: 16,
  },
  eyeButton: {
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  disabledButton: {
    opacity: 0.7,
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.white,
  },
  forgotPassword: {
    alignSelf: 'center',
    padding: 8,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textSecondary,
    textAlign: 'center'
  },
});