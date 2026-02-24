export interface Student {
    id?: number; // ? for optional
    first_name: string;
    last_name: string;
    gender: "MALE" | "FEMALE";
}

export type CreateStudentInput = Omit<Student, 'id'>;
export type UpdateStudentInput = Partial<CreateStudentInput>;