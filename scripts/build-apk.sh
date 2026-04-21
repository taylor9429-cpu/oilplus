#!/bin/bash

# OilNow+ APK Build Script
# 사용법: bash scripts/build-apk.sh

set -e

echo "🔨 OilNow+ APK 빌드 시작..."
echo ""

# 1. 의존성 설치
echo "📦 의존성 설치 중..."
npm ci

# 2. EAS CLI 설치
echo "📥 EAS CLI 설치 중..."
npm install -g eas-cli || true

# 3. APK 빌드
echo "🏗️  APK 빌드 중... (약 10-15분 소요)"
eas build --platform android --local --output ./app.apk || {
    echo "⚠️  EAS 빌드 실패, 로컬 Gradle 시도 중..."
    cd android
    ./gradlew clean assembleGeneralRelease
    cd ..
    cp android/app/build/outputs/apk/general/release/app-general-release.apk ./app.apk
}

# 4. 결과 확인
if [ -f ./app.apk ]; then
    SIZE=$(du -h ./app.apk | cut -f1)
    echo ""
    echo "✅ APK 빌드 완료!"
    echo "📁 파일: ./app.apk"
    echo "📊 크기: $SIZE"
    echo ""
    echo "🚀 다음 단계:"
    echo "1. Google Play Console에서 내부 테스트 트랙 선택"
    echo "2. APK 파일 업로드"
    echo "3. 테스터 초대"
else
    echo "❌ APK 빌드 실패"
    exit 1
fi
