export default function ApplicationLogo(props) {
    return (
         <img
         {... props}
                        src="/images/Picture1.png"
                        alt="Logo"
                        className="mx-auto w-48 h-48 object-contain mb-8"
                    />
    );
}
