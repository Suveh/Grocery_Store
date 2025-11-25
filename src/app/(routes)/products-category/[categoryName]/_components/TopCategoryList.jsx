import React from "react";
import Link from "next/link";
import Image from "next/image";

function TopCategoryList({ CategoryList, selectedCategory }) {
  return (
    <div className="flex gap-5 overflow-auto mx-7 mt-4 md:mx-20 justify-center">
      {CategoryList?.map(
        (
          category,
          index // Added optional chaining to prevent errors if CategoryList is undefined
        ) => (
          <Link
            href={"/products-category/" + category.name}
            key={category.id || index}
            className={`flex flex-col items-center gap-2 min-w-20 sm:min-w-[100px] p-3 sm:p-3 rounded-lg cursor-pointer hover:bg-green-100 group ${selectedCategory === category.name&&'bg-primary text-white '}`}
          >
            {/* Category Icon Container */}
            <div className="mb-2 sm:mb-3 p-2 sm:p-3  rounded-full ">
              <Image
                src={
                  process.env.NEXT_PUBLIC_BACKEND_URL +
                    category.icon?.[0]?.formats?.small?.url ||
                  process.env.NEXT_PUBLIC_BACKEND_URL + category.icon?.[0]?.url
                }
                width={40}
                height={40}
                alt={category.name || "category icon"}
                className="object-contain w-8 h-8 sm:w-10 sm:h-10 group-hover:scale-125 transition-all ease-in-out"
              />
            </div>

            {/* Category Name */}
            <h2 className={`text-green-800 ${selectedCategory==category.name&&'text-white'}`}>{category.name}</h2>
          </Link>
        )
      )}
    </div>
  );
}

export default TopCategoryList;
