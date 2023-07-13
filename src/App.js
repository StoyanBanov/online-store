import { Login } from "./components/auth/Login";
import { Logout } from "./components/auth/Logout";
import { NonVerified } from "./components/auth/NonVerified";
import { Register } from "./components/auth/Register";
import { Catalog } from "./components/catalog/Catalog";
import { AuthContextProvider } from "./components/common/context/AuthContext";
import { GuestUserRouteGuard } from "./components/common/guards/GuestUserRouteGuard";
import { UnverifiedUserRouteGuard } from "./components/common/guards/UnverifiedUserRouteGuard";
import { VerifiedUserRouteGuard } from "./components/common/guards/VerifiedUserRouteGuard";
import { CreateCategory } from "./components/createCategory/CreateCategory";
import { CreateItem } from "./components/createItem/CreateItem";
import { Home } from "./components/home/Home";
import { Nav } from "./components/nav/Nav";

import { Navigate, Route, Routes } from "react-router-dom"

function App() {
    return (
        <div>
            <AuthContextProvider>
                <Nav />
                <Routes>
                    <Route path="/non-verified" element={<NonVerified />} />
                    <Route path="/logout" element={<Logout />} />

                    <Route element={<UnverifiedUserRouteGuard />}>
                        <Route path="/" element={<Home />} />
                        <Route path="/catalog" element={<Catalog />} />

                        <Route element={<VerifiedUserRouteGuard />}>
                            <Route path="/create">
                                <Route index={true} element={<Navigate to={'/create/item'} />} replace={true} />
                                <Route path="item" element={<CreateItem />} />
                                <Route path="category" element={<CreateCategory />} />
                            </Route>
                        </Route>

                        <Route element={<GuestUserRouteGuard />}>
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                        </Route>
                    </Route>
                </Routes>
            </AuthContextProvider>
        </div >
    );
}

export default App;
