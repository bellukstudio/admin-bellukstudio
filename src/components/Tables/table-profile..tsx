import apiService from "@/core/response/apiResponse";
import { Profile } from "@/types/profile";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const TableProfile = () => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(true);

    const itemsPerPage = 5;

    const fetchProfiles = async () => {
        try {
            const response = await apiService.get<{ profile: Profile[] }>('/myprofile');
            const fetchedProfiles = response.data.profile;
            if (fetchedProfiles.length > 0) {
                setProfiles(fetchedProfiles);
            } else {
                setProfiles([]);
            }
        } catch (error) {
            console.error('Failed to fetch profiles:', error);
        }
    };


    useEffect(() => {
        setTimeout(() => setLoading(false), 1000);
        fetchProfiles();

    }, [loading]);

    const filteredData = profiles.filter((item) =>
        item.fullname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const paginatedData = filteredData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );


    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleEdit = (id: string) => {
        router.push(`/profile/${id}`);
    };


    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this profile?")) {
            setLoading(true);
            try {
                const response = await apiService.remove<{ message: string }>(`/myprofile/${id}/delete`);

                if (response.meta.code === 200) {
                    alert(response.data.message);
                    // Filter out the deleted profile from the state to update the UI without needing to re-fetch
                    setProfiles(profiles.filter((profile) => profile.id !== id));
                    location.reload();
                } else {
                    alert("Failed to delete the profile.");
                }
            } catch (error) {
                console.error("Error during profile delete:", error);
                alert(error instanceof Error ? error.message : "An error occurred. Please try again.");
            } finally {
                setLoading(false);
            }
        }
    };


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

            {/* Table */}
            <div className="max-w-full overflow-x-auto">
                <table className="w-full table-auto">
                    <thead>
                        <tr className="bg-gray-2 text-left dark:bg-meta-4">
                            <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                                Full Name
                            </th>
                            <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                                Email
                            </th>
                            <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                                Contact
                            </th>
                            <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                                Degree
                            </th>
                            <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                                Live In
                            </th>
                            <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                                Available
                            </th>
                            <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                                Birthday
                            </th>
                            <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                                Photo
                            </th>
                            <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                                Background
                            </th>
                            <th className="px-4 py-4 font-medium text-black dark:text-white">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map((item, index) => (
                            <tr key={index}>
                                <td className="px-4 py-4">{item.fullname}</td>
                                <td className="px-4 py-4">{item.email}</td>
                                <td className="px-4 py-4">{item.contact}</td>
                                <td className="px-4 py-4">{item.degree}</td>
                                <td className="px-4 py-4">{item.liveIn}</td>
                                <td className="px-4 py-4">{item.available}</td>
                                <td className="px-4 py-4">
                                    {new Date(item.birthOfDay).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </td>
                                <td className="px-4 py-4">
                                    <Image width={100} height={100} src={item.photo} alt="photo" />
                                </td>
                                <td className="px-4 py-4">
                                    <Image width={100} height={100} src={item.background} alt="background" />
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

export default TableProfile;
