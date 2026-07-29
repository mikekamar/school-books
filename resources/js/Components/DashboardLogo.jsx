export default function ApplicationLogo(props) {
    return (
         <img
         {... props}
                        src="/images/Picture1.png"
                        alt="Logo"
                        className="mx-auto w-20 h-20 object-contain mb-2"
                    />
    );
}
