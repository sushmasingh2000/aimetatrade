import Footer from "./Footer";
import Header from "./Header";

export default function Layouts({ children, header = true, footer = true }) {
    return (
        <>
            {header && <Header />}
            {children}
            {footer && <Footer />}
        </>
    )
}