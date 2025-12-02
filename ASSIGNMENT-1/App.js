import React, { useEffect, useState, useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
  Animated,
  Easing,
  Modal,
  StatusBar,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

// For persistent sign-in state. Install: npm install @react-native-async-storage/async-storage
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

// ---------- Sample dataset: computing-related skills (more than 5) ----------
const SKILLS = [
  {
    id: '1',
    title: 'Web Development',
    subtitle: 'HTML, CSS, JS, React',
    image:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=60',
    details:
      'Build websites and frontends using modern frameworks like React and accessible design.',
  },
  {
    id: '2',
    title: 'Mobile Development',
    subtitle: 'React Native, Flutter',
    image:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=60',
    details:
      'Create mobile apps for iOS and Android. Learn native modules, performance tuning.',
  },
  {
    id: '3',
    title: 'Data Science',
    subtitle: 'Python, Pandas, ML',
    image:
      'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=800&q=60',
    details:
      'Data cleaning, visualization, and predictive models using Python and ML libraries.',
  },
  {
    id: '4',
    title: 'DevOps',
    subtitle: 'CI/CD, Docker, Kubernetes',
    image:
      'https://images.unsplash.com/photo-1526378722130-50f3b90b6e1f?auto=format&fit=crop&w=800&q=60',
    details:
      'Automate deployments, manage containers, and scale services reliably.',
  },
  {
    id: '5',
    title: 'Cybersecurity',
    subtitle: 'Hardening, Pentesting',
    image:
      'https://images.unsplash.com/photo-1555685812-4b943f1bfb48?auto=format&fit=crop&w=800&q=60',
    details:
      'Protect systems: threat modeling, secure coding, network defense and audits.',
  },
  {
    id: '6',
    title: 'UI/UX Design',
    subtitle: 'Prototyping, Research',
    image:
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=60',
    details:
      'Design interactive prototypes, do usability testing and create design systems.',
  },
  {
    id: '7',
    title: 'Cloud Computing',
    subtitle: 'AWS / GCP / Azure',
    image:
      'https://images.unsplash.com/photo-1504805572947-34fad45aed93?auto=format&fit=crop&w=800&q=60',
    details:
      'Architect scalable cloud systems, cost management, and serverless patterns.',
  },
];

// ---------- App starts here ----------
export default function App() {
  const [user, setUser] = useState(null); // {email}
  const [loading, setLoading] = useState(true);

  // Auth form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const spin = useRef(new Animated.Value(0)).current;

  // Skill modal
  const [selectedSkill, setSelectedSkill] = useState(null);
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  // list animations
  const listAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // read stored user
    (async () => {
      try {
        const token = await AsyncStorage.getItem('@skill_swap_token');
        if (token) {
          const savedEmail = await AsyncStorage.getItem('@skill_swap_email');
          setUser({ email: savedEmail || 'user@example.com' });
        }
      } catch (e) {
        console.warn('Failed to load token', e);
      } finally {
        setLoading(false);
        Animated.timing(listAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
          easing: Easing.out(Easing.exp),
        }).start();
      }
    })();
  }, []);

  // spinning logo animation for header
  useEffect(() => {
    Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 6000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [spin]);

  function spinInterpolate() {
    return spin.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });
  }

  const signIn = async () => {
    // Simple validation & faux sign-in
    if (!email.includes('@') || password.length < 3) {
      alert('Enter a valid email and a password of at least 3 chars');
      return;
    }

    // store token
    await AsyncStorage.setItem('@skill_swap_token', 'demo-token');
    await AsyncStorage.setItem('@skill_swap_email', email);
    setUser({ email });
  };

  const signOut = async () => {
    await AsyncStorage.removeItem('@skill_swap_token');
    await AsyncStorage.removeItem('@skill_swap_email');
    setUser(null);
    setEmail('');
    setPassword('');
  };

  const openSkill = (skill) => {
    setSelectedSkill(skill);
    opacityAnim.setValue(0);
    scaleAnim.setValue(0.9);
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeSkill = () => {
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => setSelectedSkill(null));
  };

  // Card animation on render
  const renderSkill = ({ item, index }) => {
    const translateY = listAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [50 + index * 10, 0],
    });
    const itemOpacity = listAnim;

    return (
      <Animated.View
        style={[
          styles.card,
          { transform: [{ translateY }], opacity: itemOpacity },
        ]}
      >
        <TouchableOpacity activeOpacity={0.8} onPress={() => openSkill(item)}>
          <Image source={{ uri: item.image }} style={styles.cardImage} />
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  // ------------------ UI ------------------
  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <StatusBar barStyle="dark-content" />
        <Animated.View style={{ transform: [{ rotate: spinInterpolate() }], marginBottom: 12 }}>
          <View style={styles.logo} />
        </Animated.View>
        <Text style={{ fontSize: 18 }}>Loading SkillSwap...</Text>
      </SafeAreaView>
    );
  }

  if (!user) {
    // Sign-in screen
    return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <SafeAreaView style={styles.container}>
          <StatusBar barStyle="dark-content" />
          <View style={styles.header}>
            <Animated.View style={{ transform: [{ rotate: spinInterpolate() }] }}>
              <View style={styles.logo} />
            </Animated.View>
            <Text style={styles.title}>SkillSwap</Text>
            <Text style={styles.subtitle}>Swap skills, learn fast — connect locally & remotely</Text>
          </View>

          <View style={styles.authBox}>
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
            />

            <TouchableOpacity style={styles.primaryButton} onPress={signIn}>
              <Text style={styles.primaryButtonText}>Sign in</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.ghostButton, { marginTop: 10 }]}
              onPress={() => {
                // Quick demo sign-in
                setEmail('demo@skillswap.app');
                setPassword('demo');
                signIn();
              }}
            >
              <Text style={styles.ghostButtonText}>Try demo account</Text>
            </TouchableOpacity>
          </View>

          <View style={{ flex: 1 }} />

          <View style={styles.footerNote}>
            <Text style={{ color: '#666' }}>Built with ❤ — animated, mobile-first UI</Text>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }

  // Main app screen with skill list
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.topBar}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Animated.View style={{ transform: [{ rotate: spinInterpolate() }], marginRight: 10 }}>
            <View style={styles.smallLogo} />
          </Animated.View>
          <View>
            <Text style={styles.welcome}>Welcome,</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
          </View>
        </View>

        <TouchableOpacity onPress={signOut} style={styles.signOutBtn}>
          <Text style={styles.signOutText}>Sign out</Text>
        </TouchableOpacity>
      </View>

      <View style={{ paddingHorizontal: 16 }}>
        <Text style={styles.sectionTitle}>Explore computing skills</Text>
        <Text style={styles.sectionSubtitle}>Tap a card to view details and request a swap</Text>
      </View>

      <FlatList
        data={SKILLS}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        renderItem={renderSkill}
        showsVerticalScrollIndicator={false}
      />

      {/* Skill details modal */}
      <Modal visible={!!selectedSkill} transparent animationType="none">
        <View style={styles.modalBackdrop}>
          <Animated.View style={[styles.modalCard, { opacity: opacityAnim, transform: [{ scale: scaleAnim }] }]}>
            {selectedSkill && (
              <>
                <Image source={{ uri: selectedSkill.image }} style={styles.modalImage} />
                <View style={{ padding: 16 }}>
                  <Text style={styles.modalTitle}>{selectedSkill.title}</Text>
                  <Text style={styles.modalSubtitle}>{selectedSkill.subtitle}</Text>
                  <Text style={styles.modalDetails}>{selectedSkill.details}</Text>

                  <View style={{ flexDirection: 'row', marginTop: 12 }}>
                    <TouchableOpacity style={styles.primaryButtonSmall} onPress={() => alert('Request sent! (demo)')}>
                      <Text style={styles.primaryButtonTextSmall}>Request swap</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.ghostButtonSmall} onPress={closeSkill}>
                      <Text style={styles.ghostButtonTextSmall}>Close</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </>
            )}
          </Animated.View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ---------- Styles ----------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFB',
  },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' },
  header: { padding: 20, alignItems: 'center' },
  logo: { width: 88, height: 88, borderRadius: 22, backgroundColor: '#5B21B6' },
  smallLogo: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#5B21B6' },
  title: { fontSize: 28, fontWeight: '700', marginTop: 10 },
  subtitle: { color: '#666', textAlign: 'center', marginTop: 6, maxWidth: 320 },

  authBox: { padding: 20, marginHorizontal: 20, marginTop: 10, borderRadius: 16, backgroundColor: '#fff', elevation: 4 },
  input: { height: 48, borderRadius: 10, paddingHorizontal: 12, backgroundColor: '#F2F4F7', marginVertical: 8 },
  primaryButton: { marginTop: 12, backgroundColor: '#5B21B6', paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  primaryButtonText: { color: '#fff', fontWeight: '600' },
  ghostButton: { alignItems: 'center', paddingVertical: 10 },
  ghostButtonText: { color: '#5B21B6', fontWeight: '600' },

  footerNote: { padding: 16, alignItems: 'center' },

  topBar: { padding: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  welcome: { color: '#666', fontSize: 12 },
  userEmail: { fontWeight: '700' },
  signOutBtn: { backgroundColor: '#F2F4F7', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 10 },
  signOutText: { color: '#333' },

  sectionTitle: { fontSize: 18, fontWeight: '700', marginTop: 8 },
  sectionSubtitle: { color: '#666', marginTop: 2 },

  card: { marginBottom: 16, borderRadius: 14, backgroundColor: '#fff', overflow: 'hidden', elevation: 3 },
  cardImage: { width: '100%', height: 140 },
  cardContent: { padding: 12 },
  cardTitle: { fontSize: 16, fontWeight: '700' },
  cardSubtitle: { color: '#666', marginTop: 4 },

  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalCard: { width: Math.min(width - 30, 520), borderRadius: 14, overflow: 'hidden', backgroundColor: '#fff' },
  modalImage: { width: '100%', height: 180 },
  modalTitle: { fontSize: 20, fontWeight: '800' },
  modalSubtitle: { color: '#6b7280', marginTop: 6 },
  modalDetails: { marginTop: 10, color: '#374151' },

  primaryButtonSmall: { backgroundColor: '#5B21B6', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10, marginRight: 10 },
  primaryButtonTextSmall: { color: '#fff', fontWeight: '700' },
  ghostButtonSmall: { backgroundColor: '#F3F4F6', paddingVertical: 10, paddingHorizontal: 14, borderRadius: 10 },
  ghostButtonTextSmall: { color: '#111827', fontWeight: '700' },
});