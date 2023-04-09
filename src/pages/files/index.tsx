import { useEffect, useState } from "react";
import api from "../../service/api";
import Image from "next/image";
import styles from "../../styles/Home.module.scss";

export default function Files(props: any) {
  const [images, setImages] = useState([]);

  useEffect(() => {
    async function getFiles() {
      try {
        const response = await api.get("/files");
        setImages(response.data);
      } catch (error) {
        console.log(error);
      }
    }
    getFiles();
  }, []);

  const myLoader = (each: string) => {
    return `http://localhost:5000/files/${each}`;
  };

  return (
    <div>
      <main>
        {images.map((each, index) => (
          <a
            key={index}
            // className={styles.bigButton}
            href={`http://localhost:5000/files/${each}`}
          >
            <Image
              loader={() => myLoader(each)}
              src={`http://localhost:5000/files/${each}`}
              width={160}
              height={160}
              objectFit="contain"
              alt="Logo Meu Festival"
              // className={styles.logo}
            />
          </a>
        ))}
      </main>
    </div>
  );
}
