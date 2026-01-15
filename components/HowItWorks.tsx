export default function HowItWorks() {
  const steps = [
    {
      title: 'Explore & Discover',
      description: 'Browse our extensive collection of cameras, lenses, and accessories. Found your perfect gear? Great!',
      icon: '🔍'
    },
    {
      title: 'Sign Up',
      description: 'Create your account with us. Quick and easy registration to get you started on your photography journey.',
      icon: '✨'
    },
    {
      title: 'KYC Verification', 
      description: 'Complete your identity verification in under 10 minutes. We keep it simple and secure.',
      icon: '🛡️'
    },
    {
      title: 'Book Your Item',
      description: 'Select your rental dates and confirm your booking. Flexible plans to suit your needs.',
      icon: '📅'
    },
    {
      title: 'Pickup or Delivery',
      description: 'Choose store pickup or convenient doorstep delivery. Your gear, your way.',
      icon: '🚚'
    },
    {
      title: 'Return Equipment',
      description: 'Return your gear at the store or schedule a pickup. Simple and stress-free.',
      icon: '✅'
    }
  ]

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Getting your perfect camera gear is simple and hassle-free. Follow these steps to start capturing your moments!
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {steps.map((step, index) => (
            <div key={index} className="text-center group">
              <div className="bg-orange-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl group-hover:bg-orange-100 transition-colors">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Guarantee */}
        <div className="bg-green-50 rounded-2xl p-8 md:p-12 text-center border border-green-100">
          <div className="text-4xl mb-6">⏰</div>
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
            Perfect Timing Guarantee
          </h3>
          <p className="text-lg text-gray-700 max-w-4xl mx-auto leading-relaxed">
            Your equipment will be delivered <strong>one day before</strong> your rental start date, and you can return it the <strong>next morning after</strong> your end date at no additional cost. More time to prepare, more flexibility to wrap up!
          </p>
        </div>

      </div>
    </section>
  )
}