import { AuthProvider } from "@/context/authContext";
import RoomProvider from "@/context/roomContext";

export const metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <AuthProvider>
                    <RoomProvider>{children}</RoomProvider>
                </AuthProvider>
            </body>
        </html>
    );
}