import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';

const Tab = createBottomTabNavigator();

// 색상 정의
const COLORS = {
  bg: '#0D1117',
  primary: '#39D353',
  secondary: '#1f6feb',
  text: '#c9d1d9',
  border: '#30363d',
  pathfinder: '#FF6B35',
  analyst: '#00B4D8',
  quartermaster: '#9B59B6',
  guide: '#39D353',
};

// 홈 화면
function HomeScreen() {
  const [playerName, setPlayerName] = useState('');
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);

  const classes = [
    { id: 'pathfinder', name: '개척자', icon: '🧭', color: COLORS.pathfinder },
    { id: 'analyst', name: '분석가', icon: '📊', color: COLORS.analyst },
    { id: 'quartermaster', name: '보급관', icon: '📦', color: COLORS.quartermaster },
    { id: 'guide', name: '길잡이', icon: '🗺️', color: COLORS.guide },
  ];

  const handleStartGame = () => {
    if (playerName.trim() && selectedClass) {
      setGameStarted(true);
      Alert.alert('게임 시작!', `${playerName}님, ${selectedClass} 직업으로 시작합니다!`);
    } else {
      Alert.alert('입력 필요', '이름과 직업을 선택해주세요.');
    }
  };

  if (gameStarted) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>오일나우+</Text>
          <Text style={styles.subtitle}>{playerName}</Text>
        </View>
        <ScrollView style={styles.content}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>레벨 1</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '25%' }]} />
            </View>
            <Text style={styles.cardText}>경험치: 250 / 1000</Text>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>오일나우+</Text>
          <Text style={styles.subtitle}>글로벌 주유 MMORPG</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>플레이어 이름</Text>
          <View style={styles.input}>
            <Text style={styles.inputText}>{playerName || '이름 입력...'}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>직업 선택</Text>
          <View style={styles.classGrid}>
            {classes.map((cls) => (
              <TouchableOpacity
                key={cls.id}
                style={[
                  styles.classCard,
                  selectedClass === cls.id && styles.classCardSelected,
                  { borderColor: cls.color },
                ]}
                onPress={() => setSelectedClass(cls.id)}
              >
                <Text style={styles.classIcon}>{cls.icon}</Text>
                <Text style={styles.className}>{cls.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: COLORS.primary }]}
          onPress={handleStartGame}
        >
          <Text style={styles.buttonText}>게임 시작</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

// 지도 화면
function MapScreen() {
  const [location, setLocation] = useState<any>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('위치 권한 필요', '위치 권한을 허용해주세요.');
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>주유소 지도</Text>
      </View>
      <View style={styles.mapContainer}>
        <Text style={styles.mapPlaceholder}>
          📍 현위치: {location ? `${location.coords.latitude.toFixed(4)}, ${location.coords.longitude.toFixed(4)}` : '위치 확인 중...'}
        </Text>
      </View>
      <View style={styles.stationList}>
        <View style={styles.stationCard}>
          <Text style={styles.stationName}>GS칼텍스 강남역점</Text>
          <Text style={styles.stationInfo}>가격: 1,650원/L | 거리: 0.5km</Text>
        </View>
        <View style={styles.stationCard}>
          <Text style={styles.stationName}>SK에너지 강남대로점</Text>
          <Text style={styles.stationInfo}>가격: 1,620원/L | 거리: 1.2km</Text>
        </View>
      </View>
    </View>
  );
}

// 영수증 화면
function ReceiptScreen() {
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      Alert.alert('영수증 인증', '영수증이 인증되었습니다! +100 XP');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>영수증 인증</Text>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>카메라로 영수증 촬영</Text>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: COLORS.secondary }]}
            onPress={pickImage}
          >
            <MaterialCommunityIcons name="camera" size={24} color="white" />
            <Text style={styles.buttonText}>카메라 열기</Text>
          </TouchableOpacity>
          {image && (
            <Image source={{ uri: image }} style={styles.previewImage} />
          )}
        </View>
      </ScrollView>
    </View>
  );
}

// 프로필 화면
function ProfileScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>프로필</Text>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.profileCard}>
          <Text style={styles.profileName}>플레이어</Text>
          <Text style={styles.profileLevel}>레벨 1</Text>
          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>경험치</Text>
              <Text style={styles.statValue}>250</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>방문</Text>
              <Text style={styles.statValue}>2</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>친구</Text>
              <Text style={styles.statValue}>0</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

// 메인 앱
export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarStyle: {
            backgroundColor: COLORS.bg,
            borderTopColor: COLORS.border,
            borderTopWidth: 1,
          },
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.text,
          tabBarIcon: ({ color, size }) => {
            let iconName = 'home';
            if (route.name === 'Map') iconName = 'map';
            else if (route.name === 'Receipt') iconName = 'receipt';
            else if (route.name === 'Profile') iconName = 'account';
            return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} options={{ title: '홈' }} />
        <Tab.Screen name="Map" component={MapScreen} options={{ title: '지도' }} />
        <Tab.Screen name="Receipt" component={ReceiptScreen} options={{ title: '영수증' }} />
        <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: '프로필' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    padding: 20,
    borderBottomColor: COLORS.border,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.text,
    marginTop: 5,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 10,
  },
  input: {
    backgroundColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    borderColor: COLORS.primary,
    borderWidth: 1,
  },
  inputText: {
    color: COLORS.text,
    fontSize: 14,
  },
  classGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  classCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  classCardSelected: {
    borderColor: COLORS.primary,
  },
  classIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  className: {
    color: COLORS.text,
    fontSize: 12,
    fontWeight: '600',
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    color: COLORS.bg,
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    backgroundColor: COLORS.border,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  cardTitle: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  cardText: {
    color: COLORS.text,
    fontSize: 14,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#1f2937',
    borderRadius: 4,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
  },
  mapContainer: {
    flex: 1,
    backgroundColor: COLORS.border,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 16,
    borderRadius: 8,
  },
  mapPlaceholder: {
    color: COLORS.text,
    fontSize: 14,
    textAlign: 'center',
  },
  stationList: {
    padding: 16,
  },
  stationCard: {
    backgroundColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderLeftColor: COLORS.primary,
    borderLeftWidth: 4,
  },
  stationName: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  stationInfo: {
    color: COLORS.text,
    fontSize: 12,
  },
  previewImage: {
    width: '100%',
    height: 300,
    borderRadius: 8,
    marginTop: 12,
  },
  profileCard: {
    backgroundColor: COLORS.border,
    borderRadius: 8,
    padding: 20,
    alignItems: 'center',
  },
  profileName: {
    color: COLORS.primary,
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  profileLevel: {
    color: COLORS.text,
    fontSize: 14,
    marginBottom: 16,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  stat: {
    alignItems: 'center',
  },
  statLabel: {
    color: COLORS.text,
    fontSize: 12,
    marginBottom: 4,
  },
  statValue: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: '600',
  },
});
