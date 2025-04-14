"use client"

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import TableEducation from "@/components/Tables/table-education";
import PrivateRoute from "@/core/routes/privateRoute";
import Link from "next/link";

const Education = () => {
    return (
        <PrivateRoute>
            <DefaultLayout>
                <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
                    <div className="mx-auto max-w-7xl py-10 px-4 sm:px-6 lg:px-8">
                        <Link
                            href="/education/create"
                            className="inline-flex items-center justify-center rounded-full bg-meta-3 px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                        >
                            Add Education
                        </Link>

                        {/* Table Section */}
                        <div className="flex flex-col gap-10 mt-10">
                            <TableEducation />
                        </div>
                    </div>
                </div>
            </DefaultLayout>
        </PrivateRoute>
    );
}

export default Education;