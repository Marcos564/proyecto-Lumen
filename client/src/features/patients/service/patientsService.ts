import { type ResponsePet, type ResponseShowMedicalRecord } from "../types/patientTypes";
import { instance } from "../../../shared/api/axiosInstance";
export const patientServices = {
    getPatients: async (petId: string): Promise<ResponsePet> => {
        try{
            const response = await instance.get<ResponsePet>(`api/pets/${petId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching patient:", error);
            throw error;
        }
    },
    getMedicalRecords: async (petId: string, pageSize: number, pageNumber: number): Promise<ResponseShowMedicalRecord> => {
        try{
            const response = await instance.get<ResponseShowMedicalRecord>(`api/pets/${petId}/medical-records?pageSize=${pageSize}&pageNumber=${pageNumber}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching treatments:", error);
            throw error;
        }
    },
    getAllPets: async (pageSize: number, pageNumber: number): Promise<ResponsePet[]> => {
        try{
            const response = await instance.get<ResponsePet[]>(`api/pets?pageSize=${pageSize}&pageNumber=${pageNumber}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching all pets:", error);
            throw error;
        }
    }
}