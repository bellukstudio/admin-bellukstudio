"use client";
import Loader from "@/components-theme/common/Loader";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import TableProfile from "@/components/Tables/table-profile.";
import apiService from "@/core/response/apiResponse";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Profile } from "@/types/profile";

const ProfilePage = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [hiddenButton, setHiddenButton] = useState<boolean>(false);


  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await apiService.get<{ profile: Profile[] }>('/myprofile');
        const fetchedProfiles = response.data.profile;
        if (fetchedProfiles.length > 0) {
          setHiddenButton(true);
        } else {
          setHiddenButton(false)
        }
        // }
      } catch (error) {
        console.error('Failed to fetch profiles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [loading]);

  if (loading) {
    return <Loader />;
  }

  return (
    <DefaultLayout>
      {/* Root container with min-h-screen to ensure full screen */}
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white overflow-x-auto">
        {/* Container content */}
        <div className="mx-auto max-w-7xl py-10 px-4 sm:px-6 lg:px-8">
          {/* Link */}
          {hiddenButton ? null : (<Link
            href="/profile/create"
            className="inline-flex items-center justify-center rounded-full bg-meta-3 px-10 py-4 text-center font-medium text-white hover:bg-opacity-90 lg:px-8 xl:px-10"
          >
            Create Profile
          </Link>)}

          {/* Table Section */}
          <div className="flex flex-col gap-10 mt-10">
            <TableProfile />
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default ProfilePage;
