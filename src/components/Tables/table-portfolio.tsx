import apiService from "@/core/response/apiResponse";
import { Portfolio } from "@/types/portfolio";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";


const TablePortfolio = () => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 5;
    const [portfolio, setPortfolio] = useState<Portfolio[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const router = useRouter();
    const filteredData = portfolio.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const fetchPortfolio = async () => {
        try {
            const response = await apiService.get<{ portfolio: Portfolio[] }>("/portfolio");
            const portfolioData = response.data.portfolio;

            if (portfolioData.length > 0) {
                setPortfolio(portfolioData);
            } else {
                setPortfolio([]);
            }
        } catch (error) {
            console.error("Error fetching portfolio:", error);
            alert(error instanceof Error ? error.message : "An error occurred. Please try again.");
        }
    }

    useEffect(() => {
        fetchPortfolio();
        setTimeout(() => setLoading(false), 1000);
    }, [loading]);
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleEdit = (id: string) => {
        router.push(`/portfolio/${id}`);
    }

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this portfolio?")) {
            setLoading(true);
            try {
                const response = await apiService.remove<{ message: string }>(`/portfolio/${id}/delete`);
                if (response.meta.code === 200) {
                    alert(response.data.message);
                    setPortfolio(portfolio.filter((portfolio) => portfolio.id !== id));
                } else {
                    alert("Failed to delete the portfolio.");
                }
            } catch (error) {
                console.error("Error during portfolio delete:", error);
                alert(error instanceof Error ? error.message : "An error occurred. Please try again.");
            }
        }
    }

    return (
        <div className="overflow-auto rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
            {/* Search Input */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-4 py-2 
                focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 
                dark:border-gray-700 dark:bg-boxdark dark:focus:border-blue-500"
                />

            </div>
            <div className="max-w-full overflow-x-auto">
                <table className="w-full table-auto">
                    <thead>
                        <tr className="bg-gray-2 text-left dark:bg-meta-4">
                            <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                                Title
                            </th>
                            <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                                Url Portfolio
                            </th>
                            <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                                Url Github
                            </th>
                            <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                                Thumbnail
                            </th>

                            <th className="px-4 py-4 font-medium text-black dark:text-white">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map((item, index) => (
                            <tr key={index}>
                                <td className="px-4 py-4">{item.title}</td>
                                <td className="px-4 py-4">{item.urlPortfolio}</td>
                                <td className="px-4 py-4">{item.urlGithub}</td>
                                <td className="px-4 py-4">
                                    <Image
                                        width={100}
                                        height={100}
                                        src={item.thumbnail ? item.thumbnail : "https://placehold.co/600x400"}
                                        alt="thumbnail"
                                    />
                                </td>

                                <td className="px-4 py-4">
                                    <div className="flex items-center space-x-4">
                                        <button
                                            onClick={() => handleEdit(item.id)}
                                            className="rounded-full bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="rounded-full bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {paginatedData.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center py-4">
                                    No results found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {/* Pagination */}
            <div className="mt-4 flex justify-end py-5">
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => handlePageChange(i + 1)}
                        className={`mx-1 rounded px-4 py-2 ${currentPage === i + 1
                            ? "bg-meta-3 text-white"
                            : "bg-gray-200 text-black dark:bg-gray-700 dark:text-white"
                            }`}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TablePortfolio;
