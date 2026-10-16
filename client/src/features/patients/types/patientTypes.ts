type Status = "alive" | "dead" | "entreatment" | "adopted" | "lost" | "unknown";
export interface ResponseShowMedicalRecord{
    title: string;
    temperature: number;
    weight: number;
    id: string;
}
export interface RequestCreatePet {
    name: string;
    age: number;
    birthDate: Date;
    status: Status;
    raceId: string;
}
export interface ResponseCreatePet {
    id: string;
}
export interface ResponsePet {
    id: string;
    ownerId: string;
    name: string;
    birthDate: Date;
    status: Status;
    race: string;
    specie: string;
}
