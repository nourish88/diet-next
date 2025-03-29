export interface Diet {
  AdSoyad: string;
  Tarih: Date | string | null;
  Sonuc: string;
  Hedef: string;
  Su: string;
  Fizik: string;
  Oguns: Ogun[];
}

export interface Ogun {
  name: string;
  time: string;
  items: Item[];
  detail: string;
  order?: number;
}

export interface Item {
  miktar: string;
  birim: string;
  besin: string;
}
