import { Clock, ThumbsUp } from "lucide-react"

export default function Testimonials() {
  const testimonials = [
    {
      name: "The Egyptian Pharaoh",
      content:
        "The app is really wonderful. Being a Product Manager myself, I would say that the User experience (UI/UX) of the app is top notch (easy to use, simple and convenient). Coming to services and delivery, I would say Pharmeasy is doing a tremendous job even during this unprecedented pandemic situation.",
      date: "October 27, 2022",
      likes: 5,
    },
    {
      name: "Manal Elkhayat",
      content:
        "Best service and app amongst all available. I have been using it for more than 3 years, and even during the pandemic, they have kept their standards high and are delivering the order within 24 hours. Keep up the good work.",
      date: "October 27, 2021",
      likes: 9,
    },
    {
      name: "Ahmed Khaled",
      content:
        "This app is a game changer for me. I am unable to go out always to buy medicinal products. MediTrack gives me the last liberty to shop essential healthcare products from home. The app is very user friendly and me being an elderly person do not find any difficulty in using it. They deliver well in time. Thanks😊",
      date: "October 27, 2021",
      likes: 15,
    },
  ]

  return (
    <section id="posts" className="bg-light-gray py-20">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <h2 className="text-4xl font-bold text-center">What Our Customers Said</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <article key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h4 className="text-xl font-semibold mb-2">{testimonial.name}</h4>
                <p className="text-gray-700 mb-4">{testimonial.content}</p>
                <div className="flex justify-between text-gray-500 text-sm">
                  <span className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" /> {testimonial.date}
                  </span>
                  <span className="flex items-center">
                    <ThumbsUp className="h-4 w-4 mr-1" /> {testimonial.likes} Likes
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
