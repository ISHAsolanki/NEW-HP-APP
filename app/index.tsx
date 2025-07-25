// import { Text, View } from "react-native";

// export default function Index() {
//   return (
//     <View
//       style={{
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       <Text>Edit app/index.tsx to edit this screen.</Text>
//     </View>
//   );
// }

import React, { useState, useEffect } from 'react';
import { User, Phone, Mail, IdCard, Eye, EyeOff } from 'lucide-react-native';


// --- Modern Dark Blue Color Palette ---
const Colors = {
  primary: '#0D47A1',    // A deep, professional dark blue
  background: '#F0F2F5', // A very light, clean grey background
  surface: '#FFFFFF',     // White for cards and surfaces
  text: '#1D3557',        // A dark, strong blue for primary text
  textSecondary: '#6C757D',// A muted grey for secondary text and icons
  border: '#E9ECEF',      // A light border color
  white: '#FFFFFF',
};

// --- Function to load Google Fonts for web ---
const loadGoogleFont = (fontFamily) => {
  const link = document.createElement('link');
  link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(' ', '+')}:wght@400;600;700&display=swap`;
  link.rel = 'stylesheet';
  document.head.appendChild(link);
};


export default function AuthScreen() {
  // --- Load the custom fonts ---
  const [fontsLoaded, setFontsLoaded] = useState(false);
  
  useEffect(() => {
    loadGoogleFont('Inter');
    // In a web environment, we can assume the font starts loading immediately.
    // A more robust solution might use FontFaceObserver, but this is sufficient for this context.
    setFontsLoaded(true); 
    document.title = "Vihar Electricals - HP Gas";
  }, []);


  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    emailOrPhone: '',
    phone: '',
    consumerNumber: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = () => {
    if (isLoading) return;

    // --- Registration Logic ---
    if (!isLogin) {
      if (formData.password !== formData.confirmPassword) {
        alert('Error: Passwords do not match.');
        return;
      }
      if (!formData.name || !formData.emailOrPhone || !formData.password) {
        alert('Error: Please fill all required fields for registration.');
        return;
      }
    }

    // --- Login Logic ---
    if (isLogin) {
        if (!formData.emailOrPhone || !formData.password || !formData.consumerNumber) {
            alert('Error: Please fill all fields to log in.');
            return;
        }
    }

    setIsLoading(true);

    // Simulate a network request delay
    setTimeout(() => {
      setIsLoading(false);
      if (isLogin) {
        // Simulate Login
        console.log('Attempting Login with:', {
          emailOrPhone: formData.emailOrPhone,
          consumerNumber: formData.consumerNumber,
          password: formData.password,
        });
        alert('Login Attempted. Check the console for the submitted data.');
      } else {
        // Simulate Registration
        console.log('Attempting to Register with:', formData);
        alert('Registration Attempted. Check the console for the submitted data.');
      }
    }, 1500);
  };

  // --- Show a loading indicator while fonts are loading ---
  if (!fontsLoaded) {
    return <div style={styles.loadingContainer}>Loading...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <img
          src={`https://placehold.co/120x120/${Colors.primary.substring(1)}/FFFFFF?text=VE&font=Inter`}
          style={styles.logo}
          alt="Vihar Electricals Logo"
        />
        <p style={styles.title}>Vihar Electricals</p>
        <p style={styles.subtitle}>HP Gas Service</p>
      </div>

      <div style={styles.formContainer}>
        <div style={styles.toggleContainer}>
          <button
            style={{...styles.toggleButton, ...(isLogin ? styles.activeToggle : {})}}
            onClick={() => setIsLogin(true)}
          >
            <span style={{...styles.toggleText, ...(isLogin ? styles.activeToggleText : {})}}>Login</span>
          </button>
          <button
            style={{...styles.toggleButton, ...(!isLogin ? styles.activeToggle : {})}}
            onClick={() => setIsLogin(false)}
          >
            <span style={{...styles.toggleText, ...(!isLogin ? styles.activeToggleText : {})}}>Register</span>
          </button>
        </div>

        <div style={styles.inputContainer}>
          {!isLogin && (
            <div style={styles.inputWrapper}>
              <User size={20} color={Colors.textSecondary} style={styles.inputIcon} />
              <input
                style={styles.input}
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          )}

          <div style={styles.inputWrapper}>
            <Mail size={20} color={Colors.textSecondary} style={styles.inputIcon} />
            <input
              style={styles.input}
              placeholder="Email or Phone Number"
              value={formData.emailOrPhone}
              onChange={(e) => setFormData({ ...formData, emailOrPhone: e.target.value })}
              autoCapitalize="none"
            />
          </div>

          {!isLogin && (
            <div style={styles.inputWrapper}>
              <Phone size={20} color={Colors.textSecondary} style={styles.inputIcon} />
              <input
                style={styles.input}
                placeholder="Contact Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                type="tel"
              />
            </div>
          )}

          <div style={styles.inputWrapper}>
            <IdCard size={20} color={Colors.textSecondary} style={styles.inputIcon} />
            <input
              style={styles.input}
              placeholder="Consumer Number"
              value={formData.consumerNumber}
              onChange={(e) => setFormData({ ...formData, consumerNumber: e.target.value })}
            />
          </div>

          <div style={styles.inputWrapper}>
            <div style={styles.passwordInputContainer}>
              <input
                style={styles.passwordInput}
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                type={showPassword ? "text" : "password"}
              />
              <button
                style={styles.eyeButton}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} color={Colors.textSecondary} /> : <Eye size={20} color={Colors.textSecondary} />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div style={styles.inputWrapper}>
              <input
                style={styles.input}
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                type="password"
              />
            </div>
          )}
        </div>

        <button
          style={{...styles.submitButton, ...(isLoading ? styles.disabledButton : {})}}
          onClick={handleSubmit}
          disabled={isLoading}
        >
          <span style={styles.submitButtonText}>
            {isLoading ? 'Please wait...' : (isLogin ? 'Login' : 'Register')}
          </span>
        </button>

        {isLogin && (
          <button style={styles.forgotPassword}>
            <span style={styles.forgotPasswordText}>Forgot Password?</span>
          </button>
        )}
      </div>

      <div style={styles.footer}>
        <p style={styles.footerText}>
          Secure and reliable gas delivery service
        </p>
      </div>
    </div>
  );
}

const styles = {
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: Colors.background,
    fontFamily: 'sans-serif',
    color: Colors.primary,
    fontSize: '1.2rem',
  },
  container: {
    minHeight: '100vh',
    backgroundColor: Colors.background,
    fontFamily: '"Inter", sans-serif',
  },
  header: {
    backgroundColor: Colors.primary,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '50px 20px 60px 20px',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  logo: {
    width: 90,
    height: 90,
    borderRadius: 20,
    marginBottom: 16,
    border: `3px solid rgba(255, 255, 255, 0.5)`,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.white,
    fontFamily: '"Inter", sans-serif',
    margin: 0,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '400',
    color: Colors.white,
    opacity: 0.9,
    margin: 0,
  },
  formContainer: {
    backgroundColor: Colors.surface,
    margin: '-40px 20px 0 20px',
    borderRadius: 24,
    padding: 24,
    boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
  },
  toggleContainer: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: 16,
    padding: 5,
    marginBottom: 24,
  },
  toggleButton: {
    flex: 1,
    padding: '14px 0',
    alignItems: 'center',
    borderRadius: 12,
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  activeToggle: {
    backgroundColor: Colors.primary,
    boxShadow: `0 4px 10px rgba(13, 71, 161, 0.3)`,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
    fontFamily: '"Inter", sans-serif',
  },
  activeToggleText: {
    color: Colors.white,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 14,
    padding: '0 16px',
    marginBottom: 18,
    border: `1px solid ${Colors.border}`,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '400',
    color: Colors.text,
    padding: '16px 0',
    border: 'none',
    backgroundColor: 'transparent',
    outline: 'none',
    fontFamily: '"Inter", sans-serif',
  },
  passwordInputContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '400',
    color: Colors.text,
    padding: '16px 0',
    border: 'none',
    backgroundColor: 'transparent',
    outline: 'none',
    fontFamily: '"Inter", sans-serif',
  },
  eyeButton: {
    padding: 4,
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: Colors.primary,
    padding: '18px 0',
    borderRadius: 14,
    width: '100%',
    textAlign: 'center',
    border: 'none',
    cursor: 'pointer',
    marginBottom: 16,
    boxShadow: `0 5px 15px rgba(13, 71, 161, 0.4)`,
    transition: 'transform 0.1s, box-shadow 0.1s',
  },
  disabledButton: {
    opacity: 0.7,
    cursor: 'not-allowed',
    boxShadow: 'none',
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.white,
    fontFamily: '"Inter", sans-serif',
  },
  forgotPassword: {
    display: 'block',
    margin: '0 auto',
    width: 'fit-content',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
    fontFamily: '"Inter", sans-serif',
  },
  footer: {
    textAlign: 'center',
    padding: '30px 20px 40px',
  },
  footerText: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.textSecondary,
    textAlign: 'center',
    margin: 0,
    fontFamily: '"Inter", sans-serif',
  },
};
