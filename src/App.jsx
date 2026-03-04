import axios from "axios";
import { useState } from "react";
import "./App.css";

const GATEWAY_URL = "http://10.117.9.40:8080";

function App() {
  const [data, setData] = useState("");

  // 1. 로그인 요청 (Gateway의 OAuth2 엔드포인트로 이동)
  const login = () => {
    window.location.href = `${GATEWAY_URL}/oauth2/authorization/keycloak`;
  };

  const logout = () => {
    window.location.href = `${GATEWAY_URL}/logout`;
  };

  // 2. 리소스 서버 데이터 요청 (Gateway를 경유)
  const fetchData = async () => {
    try {
      const response = await axios.get(`${GATEWAY_URL}/api/users`, {
        withCredentials: true, // ★중요: 이 설정이 있어야 세션 쿠키가 전송됨
      });
      console.log(response);
      setData(JSON.stringify(response.data));
    } catch (error) {
      console.error("데이터 호출 실패:", error);
      setData("데이터를 가져오지 못했습니다. 로그인이 필요할 수 있습니다.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>API Gateway Test</h1>
      <button onClick={login} style={{ marginRight: "10px" }}>
        로그인
      </button>
      <button onClick={fetchData}>데이터 가져오기</button>
      <button onClick={logout}>로그아웃</button>
      <hr />
      <h3>응답 결과:</h3>
      <pre>{data}</pre>
    </div>
  );
}

export default App;
