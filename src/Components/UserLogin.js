import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function UserLogin() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    useEffect(() => {
        token && localStorage.setItem("token", token);
        token && localStorage.setItem("login_user", "User");
        navigate("/dashboard")
    }, [token])
    return <>
        <div style={{
            height: "100vh",
            width: "100vh",
            textAlign: "center"
        }}>Waiting for Safe Navigation</div>
    </>
}