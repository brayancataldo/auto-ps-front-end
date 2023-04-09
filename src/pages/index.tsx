import React, { useState, useEffect } from "react";
import api from "../service/api";
import {
  Alert,
  Box,
  Container,
  Divider,
  IconButton,
  ImageListItemBar,
  Modal,
  Snackbar,
  Stack,
} from "@mui/material";
import { NextPage } from "next";
import Image from "next/image";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import styles from "./../styles/Home.module.scss";
import DownloadIcon from "@mui/icons-material/Download";
import CloseIcon from "@mui/icons-material/Close";
import { GeneratorKeyValue } from "../components/GeneratorKeyValue";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { GenerationTable } from "../components/GeneratorTable";
import { AlertType } from "../types/SnackbarType";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}

const Home: NextPage = () => {
  const [images, setImages] = useState([]);
  const [imageVersion, setImageVersion] = useState<number>(0);
  const [errorVisible, setErrorVisible] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [snackbarType, setSnackbarType] = useState<AlertType>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [imageFullscreen, setImageFullscreen] = useState<string>("");
  const [tab, setTab] = useState<number>(0);

  async function getFiles(): Promise<void> {
    setImageVersion((prev) => prev + 1);
    try {
      const response = await api.get("/files");
      setImages(response.data.reverse());
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getFiles();
  }, []);

  function closeError() {
    setErrorVisible(false);
  }

  function showSnackbar(type: AlertType, m: string) {
    setErrorVisible(true);
    setSnackbarType(type);
    setMessage(m);
  }

  function openModal(image: string) {
    setModalVisible(true);
    setImageFullscreen(image);
  }

  function closeModal() {
    setModalVisible(false);
    setImageFullscreen("");
  }

  const myLoader = (each: string) => {
    return `http://localhost:5000/files/${each}`;
  };

  function handleChangeTab(event: React.SyntheticEvent, newValue: number) {
    setTab(newValue);
  }

  function returnIdElement(index: number) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  return (
    <div className={styles.generalContainer}>
      <Container maxWidth="sm">
        <Snackbar
          open={errorVisible}
          autoHideDuration={6000}
          onClose={closeError}
        >
          <Alert
            onClose={closeError}
            severity={snackbarType}
            sx={{ width: "100%" }}
          >
            {message}
          </Alert>
        </Snackbar>
        <Stack spacing={2}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tab}
              onChange={handleChangeTab}
              aria-label="basic tabs example"
            >
              <Tab label="Por Chave e Valor" {...returnIdElement(0)} />
              <Tab label="Por Tabela" {...returnIdElement(1)} />
              <Tab label="Por Modelo" {...returnIdElement(2)} />
            </Tabs>
          </Box>

          <TabPanel value={tab} index={0}>
            <GeneratorKeyValue showSnackbar={showSnackbar} refresh={getFiles} />
          </TabPanel>
          <TabPanel value={tab} index={1}>
            <GenerationTable />
          </TabPanel>
          <TabPanel value={tab} index={2}>
            Item Three
          </TabPanel>

          <Divider />
          <div>
            <h2>Imagens geradas ({images.length})</h2>
          </div>
          <ImageList
            sx={{ width: 600, maxHeight: 500 }}
            cols={3}
            rowHeight={200}
          >
            {images.map((each, index) => (
              <ImageListItem key={index} onClick={() => openModal(each)}>
                <img
                  src={`http://localhost:5000/files/${each}?w=164&h=164&fit=crop&auto=formatversao=${imageVersion}"`}
                  srcSet={`${each}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                  alt={each}
                  loading="lazy"
                />
                <ImageListItemBar
                  sx={{
                    background:
                      "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, " +
                      "rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)",
                  }}
                  title={each}
                  position="top"
                  actionIcon={
                    <IconButton
                      sx={{ color: "white" }}
                      aria-label={`star ${each}`}
                      href={`http://localhost:5000/files/${each}`}
                      onClick={(event) => {
                        event.stopPropagation();
                      }}
                    >
                      <DownloadIcon />
                    </IconButton>
                  }
                  actionPosition="right"
                />
              </ImageListItem>
            ))}
          </ImageList>
        </Stack>
      </Container>
      <Modal
        open={modalVisible}
        onClose={closeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={styles.modal}>
          <Stack>
            <Box className={styles.closeContainer}>
              <IconButton sx={{ color: "#404040" }} onClick={closeModal}>
                <CloseIcon />
              </IconButton>
            </Box>
            <h3>{imageFullscreen}</h3>
            <Image
              loader={() => myLoader(imageFullscreen)}
              src={`http://localhost:5000/files/${imageFullscreen}`}
              width={500}
              height={500}
              objectFit="contain"
              alt="Logo Meu Festival"
            />
          </Stack>
        </Box>
      </Modal>
    </div>
  );
};

export default Home;
