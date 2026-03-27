import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function AboutUs() {
  return (
    <Card className="mx-auto w-full max-w-6xl bg-white dark:bg-stone-800 shadow-lg">
      <CardHeader className="text-3xl font-bold mb-4">About Us</CardHeader>
      <CardContent>
        <p className="text-lg text-stone-700 dark:text-white">
          We are a passionate team dedicated to providing the best news experience. Our mission is to deliver accurate and timely news to our users, keeping them informed about the world around them to all information at last updated for interests now. News platform is built with modern web technologies to ensure a seamless and enjoyable user experience. We value our users and strive to create a community where everyone can share and access news easily. To be a part of this community, simply register and start exploring the latest news articles.
        </p>
        <p className="text-stone-700 dark:text-white">
          Our team is committed to maintaining the highest standards of journalism and user experience. We believe in the power of information and its ability to connect people and foster understanding. Thank you for being a part of our journey, and we look forward to bringing you the news that matters most information to you.
        </p>
        <p className="text-stone-700 dark:text-white">
          If you have any questions, feedback, or suggestions, please don't hesitate to reach out to us. We are always eager to hear from our users and improve our platform based on your needs and preferences.
        </p>
      </CardContent>
     </Card>
  )
}  
