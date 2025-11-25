import GlobalApi from "./_utils/GlobalApi";
import SliderList from "./_components/Sliders";
import CategoryList from "./_components/CategoryList";
import ProductList from "./_components/ProductList";
import Footer from "./_components/Footer";
import Image from "next/image";

export default async function Home() {
  let sliderList = [];

  try {
    const response = await GlobalApi.getSliders();
    console.log("Full API response:", response);
    // The API returns an array directly, not nested under data
    sliderList = response || [];
  } catch (error) {
    console.error("Error fetching sliders:", error);
    sliderList = [];
  }

  const CategoryListData = await GlobalApi.getCategoryList();
  const productList = await GlobalApi.getAllProducts();

  return (
    <div>
      <SliderList sliderList={sliderList} />

      <section id="categories">
        <CategoryList CategoryList={CategoryListData}/>
      </section>

      <ProductList productList={productList} />
      <div className="w-full flex justify-center">
        <div className="relative w-full max-w-7xl h-64 md:h-80 lg:h-96">
          <Image
            src='/banner2.png'
            fill
            alt='Special offers banner'
            className="object-cover rounded-xl md:rounded-2xl"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px"
            priority
          />
        </div>
      </div>

      <Footer />
    </div>
  );
}
