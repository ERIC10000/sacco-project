import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
export default function NotFound() {
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-50", children: _jsxs("div", { className: "text-center", children: [_jsx("h1", { className: "text-6xl font-bold text-gray-900", children: "404" }), _jsx("p", { className: "text-gray-600 mt-2", children: "Page not found" }), _jsx(Link, { to: "/dashboard", className: "mt-4 inline-block bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700", children: "Go to Dashboard" })] }) }));
}
