"use client"

import DefaultLayout from "@/components/Layouts/DefaultLayout";
import TablePortfolio from "@/components/Tables/table-portfolio";
import Link from "next/link";

const Portfolio = () => {
    return (
        <DefaultLayout>
            {/* Root container with min-h-screen to ensure full screen */}
            <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
                {/* Container content */}
                <div className="mx-auto max-w-7xl py-10 px-4 sm:px-6 lg:px-8">
                    {/* Link */}
                    <Link
                        href="#"
                        className="inline-flex items-center justify-center rounded-full bg-meta-3 px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
                    >
                        Add Portfolio
                    </Link>

                    {/* Table Section */}
                    <div className="flex flex-col gap-10 mt-10">
                        <TablePortfolio/>
                    </div>
                </div>
            </div>
        </DefaultLayout>
    );
}

export default Portfolio;