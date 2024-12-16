"use client"

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import TableExperience from "@/components/Tables/table-experience";
import Link from "next/link";

const Experience = () => {
    return (
        <DefaultLayout>
            <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
                <div className="mx-auto max-w-7xl py-10 px-4 sm:px-6 lg:px-8">
                    <Link
                        href="#"
                        className="inline-flex items-center justify-center rounded-full bg-meta-3 px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                    >
                        Add Experience
                    </Link>

                    {/* Table Section */}
                    <div className="flex flex-col gap-10 mt-10">
                        <TableExperience />
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
}

export default Experience;