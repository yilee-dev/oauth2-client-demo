import React, { useEffect, useState } from "react";
import { initKeycloak, doLogin, doLogout } from "./utils/keycloak";
import { useAuthStore } from "./store/authStore";
import axios from "axios";
import api from "./utils/axios";

function App() {
  const [initialized, setInitialized] = useState(false);
  const { user, accessToken } = useAuthStore();

  useEffect(() => {
    initKeycloak((auth) => {
      setInitialized(true);
    });
  }, []);

  const callApi = async () => {
    try {
      const response = await api.get("/api/users");
      alert(`API 응답: ${JSON.stringify(response.data)}`);
    } catch (err) {
      console.error("API 호출 실패:", err);
    }
  };

  if (!initialized) return <div>인증 확인 중...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>API Gateway 테스트</h1>
      {!user ? (
        <button onClick={doLogin}>로그인</button>
      ) : (
        <div>
          <p>반갑습니다, {user.name}님!</p>
          <button onClick={callApi}>Gateway API 호출</button>
          <button onClick={doLogout} style={{ marginLeft: "10px" }}>
            로그아웃
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
