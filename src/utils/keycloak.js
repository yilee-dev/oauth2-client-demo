import Keycloak from "keycloak-js";
import { useAuthStore } from "../store/authStore";

// Keycloak 설정 정보
const keycloakConfig = {
  url: "http://10.100.104.24:8080",
  realm: "donghee",
  clientId: "api-gateway", // Keycloak에서 생성한 Public 클라이언트 ID
};

const keycloak = new Keycloak(keycloakConfig);

export const initKeycloak = (onAuthenticated) => {
  keycloak
    .init({
      onLoad: "check-sso", // 이미 로그인되어 있는지 확인
      pkceMethod: "S256", // 보안 강화를 위한 PKCE 활성화
    })
    .then((authenticated) => {
      if (authenticated) {
        // 성공 시 Zustand 스토어에 토큰 저장
        useAuthStore
          .getState()
          .setAuth(
            keycloak.token,
            keycloak.refreshToken,
            keycloak.idToken,
            keycloak.tokenParsed,
          );
      }
      onAuthenticated(authenticated);
    })
    .catch((err) => console.error("Keycloak 초기화 실패:", err));
};

export const doLogin = () => keycloak.login();

// 핵심: 인가 서버 세션까지 종료하는 로그아웃
export const doLogout = () => {
  useAuthStore.getState().clearAuth(); // 로컬 스토리지 비우기
  keycloak.logout({
    redirectUri: "https://10.117.9.40:3000", // 로그아웃 후 복귀 주소
  });
};

export const updateToken = async (minValidity = 30) => {
  try {
    // 토큰 만료 30초 전이라면 갱신 수행
    const refreshed = await keycloak.updateToken(minValidity);
    if (refreshed) {
      console.log("Access Token이 성공적으로 갱신되었습니다.");
      // Zustand 스토어 업데이트
      useAuthStore
        .getState()
        .setAuth(keycloak.token, keycloak.idToken, keycloak.tokenParsed);
    }
  } catch (error) {
    console.error("토큰 갱신 실패 (세션 만료):", error);
    doLogout(); // 갱신 실패 시(Refresh Token도 만료 시) 강제 로그아웃
  }
};

export default keycloak;
