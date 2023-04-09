import React, { useContext, useEffect, useState } from "react";
import styles from "./styles.module.scss";
import Logo from "../../assets/logo.png";
import Image from "next/image";
import { AuthContext } from "../../contexts/auth";
import axios from "axios";
import Link from "next/link";
import AuthenticationService from "../../service/auth";

export function Navbar() {
  const { user, logOut } = useContext(AuthContext);
  const [spotifyOAuth, setSpotifyOAuth] = useState("");

  useEffect(() => {
    axios.get("/api/oauth").then((response: any) => {
      setSpotifyOAuth(response.data.link);
      console.log(response.data);
    });
  }, []);

  function handleLogin() {
    AuthenticationService.loginWithGoogle();
  }

  return (
    <nav className={styles.navbar}>
      <Link href="/" passHref>
        <button className={styles.bigButton}>
          <div className={styles.containerLogo}>
            <Image
              src={Logo}
              width={120}
              height={60}
              objectFit="contain"
              alt="Logo Meu Festival"
              className={styles.logo}
            />
          </div>
        </button>
      </Link>
      <div>
        {user ? (
          <div className={styles.containerHeader}>
            <a
              // href={`/profile/${user.id}`}
              className={styles.bigButton}
            >
              <div className={styles.containerProfile}>
                <span>{user.name}</span>
                <Image
                  loader={() => user.image}
                  width={34}
                  height={34}
                  // layout="fill"
                  src={user?.image}
                  objectFit="contain"
                  alt="Logo Meu Festival"
                  className={styles.userImage}
                />
              </div>
            </a>

            <button className={styles.bigButton} onClick={logOut}>
              Sair
            </button>
          </div>
        ) : (
          <button onClick={handleLogin} className={styles.bigButton}>
            {/* <a href={spotifyOAuth} className={styles.bigButton}> */}
            Entrar
            {/* </a> */}
          </button>
        )}
      </div>
    </nav>
  );
}
