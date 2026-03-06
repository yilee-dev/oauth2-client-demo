import axios from "axios";
import keycloak from "./keycloak";
import { useAuthStore } from "../store/authStore";

const api = axios.create({
  baseURL: "http://10.117.9.40:8080",
});

// 요청 인터셉터: 모든 요청 직전에 토큰 상태 확인
api.interceptors.request.use(
  async (config) => {
    try {
      const refreshed = await keycloak.updateToken(30);

      if (refreshed) {
        console.log("토큰이 성공적으로 갱신되었습니다.");
        // 2. 갱신된 새 토큰들을 Zustand 스토어에 업데이트
        useAuthStore
          .getState()
          .setAuth(keycloak.token, keycloak.refreshToken, keycloak.tokenParsed);
      }

      // 3. 최신 토큰을 Authorization 헤더에 삽입
      config.headers.Authorization = `Bearer ${keycloak.token}`;
    } catch (error) {
      console.error("토큰 갱신 실패 또는 세션 만료:", error);
      // 리프레시 토큰까지 만료된 경우 로그아웃 처리
      keycloak.login();
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
