export type GenerateType = {
  layerName: string;
  value: string;
};

export type GenerateBodyType = {
  psd_filename?: string;
  new_name?: string;
  layers: GenerateType[];
};
