export default function StatusBadge({ status }) {

    const styles = {
        Pending:
            "bg-yellow-100 text-yellow-800",

        "In Progress":
            "bg-blue-100 text-blue-800",

        Completed:
            "bg-green-100 text-green-800",

        Cancelled:
            "bg-red-100 text-red-800",
    };

    return (
        <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                styles[status] ||
                "bg-gray-100 text-gray-700"
            }`}
        >
            {status}
        </span>
    );
}