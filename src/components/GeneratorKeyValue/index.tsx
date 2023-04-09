import React, { useState, ChangeEvent } from "react";
import api from "./../../service/api";
import TextField from "@mui/material/TextField";
import { Button, IconButton, Stack } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { LoadingButton } from "@mui/lab";
import styles from "./../../styles/Home.module.scss";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { GenerateBodyType, GenerateType } from "../../types/GenerateType";
import { AlertType } from "../../types/SnackbarType";

type KeyValueProps = {
  showSnackbar: (type: AlertType, m: string) => void;
  refresh: () => void;
};

export function GeneratorKeyValue({ showSnackbar, refresh }: KeyValueProps) {
  const [model, setModel] = useState<GenerateBodyType>({
    psd_filename: "",
    new_name: "",
    layers: [{ layerName: "", value: "" }],
  });
  const [loadingGeneration, setLoadingGeneration] = useState<boolean>(false);

  async function postFile(e: React.FormEvent<EventTarget>, file: File) {
    e.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append("myFile", file);
    try {
      await api.post("/files", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error) {
      console.log(error);
    }
  }

  async function generateArt(e: React.FormEvent<EventTarget>) {
    e.preventDefault();
    setLoadingGeneration(true);

    try {
      const response = await api.post("/generate", model);
      showSnackbar("success", response.data);
    } catch (error: any) {
      if (error) showSnackbar("error", error.response.data);
    } finally {
      setLoadingGeneration(false);
      refresh();
    }
  }

  function addMore() {
    setModel({
      ...model,
      layers: [...model.layers, { layerName: "", value: "" }],
    });
  }

  function updateLayers(e: ChangeEvent<HTMLInputElement>, index: number) {
    setModel({
      ...model,
      layers: model.layers.map((layer, i) =>
        i === index ? { ...layer, [e.target.name]: e.target.value } : layer
      ),
    });
  }

  function deleteRow(index: number) {
    if (index === 0) return;
    setModel({
      ...model,
      layers: model.layers.filter((layer, i) => i !== index),
    });
  }

  return (
    <div>
      <form onSubmit={generateArt}>
        <Stack spacing={4}>
          <div>
            <title>Gerar Imagem - Chave e valor</title>
            <h1>Automatização de Imagem</h1>
            <h2>Gerar por chave e valor</h2>
            <p>
              Informe o nome do arquivo e forneça as chaves com seus valores
              correspondentes que irão ser substituídos.
            </p>
          </div>

          <TextField
            value={model.new_name}
            label="Nome do arquivo"
            variant="standard"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setModel({ ...model, new_name: e.target.value })
            }
          />

          {model.layers
            ? model.layers.map((each: GenerateType, index: number) => (
                <Stack
                  spacing={2}
                  direction="row"
                  key={index}
                  justifyContent="space-between"
                >
                  <TextField
                    value={each.layerName}
                    name="layerName"
                    label="Nome da camada"
                    variant="standard"
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      updateLayers(e, index)
                    }
                  />
                  <TextField
                    value={each.value}
                    name="value"
                    label="Valor"
                    variant="standard"
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      updateLayers(e, index)
                    }
                  />
                  <IconButton
                    onClick={() => deleteRow(index)}
                    color="primary"
                    aria-label="Excluir linha"
                  >
                    <ClearIcon />
                  </IconButton>
                </Stack>
              ))
            : null}
          <Button onClick={addMore} className={styles.button}>
            Adicionar novo
            <AddCircleOutlineIcon />
          </Button>
          <LoadingButton
            className={styles.button}
            loading={loadingGeneration}
            type="submit"
            variant="contained"
          >
            Enviar
          </LoadingButton>
        </Stack>
      </form>
    </div>
  );
}
