import Header from "@/components/shop/Navbar";

export default function RootLayout({ children }) {
    return (
        <div>
            <Header />
            {children}
        </div>
    );
}