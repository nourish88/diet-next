export interface Ogun{
    name:string;
    time: string;
    items:MenuItem[];
    detail:string;  order: number;
}

export interface Diet {

    Oguns: Ogun[],
    Diyetisyen: "Ezgi Evgin AKTAŞ",
    Tarih?: Date|null,
    Hedef: string,
    Sonuc: string,
    AdSoyad: string,
    Su: string,
    Fizik:string,
}

export interface Item{
    miktar:string;
    birim:string;
    besin:string;

}


const OGUN: Ogun[] = [{
    time: "07:00",
    items: [],
    name: "Uyanınca",
    detail:"",
    order:1
},{
    time: "07:30",
    items:[],
    name: "Kahvaltı",
    detail:"",
    order:2
}]


