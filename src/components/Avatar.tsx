export const Avatar = ({ src, isDark }: { src: string, isDark: boolean }) => (
    <div className="relative mb-6 group cursor-pointer w-fit">
        {/* Dynamic Glow Background */}
        <div className={`absolute -inset-1 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-pulse ${isDark ? 'bg-teal-400' : 'bg-teal-600'
            }`}></div>

        {/* Avatar Container */}
        <div className={`relative h-24 w-24 rounded-full p-1 ring-2 ring-offset-2 transition-all duration-300 ${isDark
            ? 'bg-slate-900 ring-slate-800 ring-offset-slate-900 group-hover:ring-teal-400'
            : 'bg-white ring-slate-200 ring-offset-white group-hover:ring-teal-500'
            }`}>
            <img
                className="h-full w-full rounded-full object-cover transition-all duration-500"
                src={src}
                alt="Profile"
            />
        </div>
    </div>
)
