
const LinkLocations = () => {
    return (
        <div className="bg-white rounded-md shadow-md p-8 my-8">

            <h3 className="text-xl font-bold mb-4">
                Locations
            </h3>
            <table className="w-full">
                <thead>
                    <tr>
                        <th className="text-left">Sr#</th>
                        <th className="text-left">Country</th>
                        <th className="text-left">Engangements</th>
                        <th className="text-left">%</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>United States</td>
                        <td>100</td>
                        <td>50%</td>
                    </tr>
                    <tr>
                        <td>2</td>
                        <td>Canada</td>
                        <td>50</td>
                        <td>25%</td>
                    </tr>
                </tbody>

            </table>
        </div>
    )
}

export default LinkLocations