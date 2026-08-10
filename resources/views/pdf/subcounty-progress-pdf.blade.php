<!DOCTYPE html>
<html>
<head>

    <meta charset="UTF-8">

    <title>
        {{ $county['name'] }} - Sub County Progress
    </title>

    <style>

        @page {
            margin: 30px 25px;
        }

        body {
            font-family: Arial, sans-serif;
            font-size: 11px;
            color: #000;
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
        }

        .header h1 {
            margin: 0;
            font-size: 20px;
        }

        .header h2 {
            margin: 5px 0;
            font-size: 16px;
        }

        .header p {
            margin: 3px 0;
            font-size: 11px;
        }

        .summary {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }

        .summary th,
        .summary td {
            border: 1px solid #000;
            padding: 6px;
            text-align: center;
        }

        .summary th {
            font-weight: bold;
            background: #f2f2f2;
        }

        .summary td:first-child {
            text-align: left;
        }

        .progress-table {
            width: 100%;
            border-collapse: collapse;
        }

        .progress-table th,
        .progress-table td {
            border: 1px solid #000;
            padding: 7px 5px;
        }

        .progress-table th {
            background: #f2f2f2;
            font-weight: bold;
            text-align: center;
        }

        .progress-table td {
            text-align: center;
        }

        .progress-table td:first-child {
            text-align: left;
        }

        .totals {
            font-weight: bold;
            background: #f2f2f2;
        }

        .footer {
            margin-top: 20px;
            font-size: 9px;
            text-align: right;
        }

    </style>

</head>

<body>

    <div class="header">

        <h1>DELIVERY PROGRESS REPORT</h1>

        <h2>
            {{ strtoupper($county['name']) }} COUNTY
        </h2>

        <p>
            Delivery Progress by Sub-County
        </p>

        <p>
            Generated: {{ now()->format('d/m/Y H:i') }}
        </p>

    </div>


    {{-- COUNTY SUMMARY --}}

    <table class="summary">

        <thead>

            <tr>

                <th>County</th>

                <th>Total Schools</th>

                <th>Delivered</th>

                <th>Pending</th>

                <th>Books Allocated</th>

                <th>Books Delivered</th>

                <th>Books Pending</th>

                <th>Progress</th>

            </tr>

        </thead>

        <tbody>

            <tr>

                <td>
                    {{ $county['name'] }}
                </td>

                <td>
                    {{ number_format($county['total']) }}
                </td>

                <td>
                    {{ number_format($county['delivered']) }}
                </td>

                <td>
                    {{ number_format($county['pending']) }}
                </td>

                <td>
                    {{ number_format($county['books_allocated']) }}
                </td>

                <td>
                    {{ number_format($county['books_delivered']) }}
                </td>

                <td>
                    {{ number_format($county['books_pending']) }}
                </td>

                <td>
                    {{ $county['progress'] }}%
                </td>

            </tr>

        </tbody>

    </table>


    {{-- SUB COUNTY TABLE --}}

    <table class="progress-table">

        <thead>

            <tr>

                <th>Sub County</th>

                <th>Total Schools</th>

                <th>Delivered</th>

                <th>Pending</th>

                <th>Books Allocated</th>

                <th>Books Delivered</th>

                <th>Books Pending</th>

                <th>Progress</th>

            </tr>

        </thead>

        <tbody>

            @foreach($subCounties as $subCounty)

                <tr>

                    <td>
                        {{ $subCounty['name'] }}
                    </td>

                    <td>
                        {{ number_format($subCounty['total']) }}
                    </td>

                    <td>
                        {{ number_format($subCounty['delivered']) }}
                    </td>

                    <td>
                        {{ number_format($subCounty['pending']) }}
                    </td>

                    <td>
                        {{ number_format($subCounty['books_allocated']) }}
                    </td>

                    <td>
                        {{ number_format($subCounty['books_delivered']) }}
                    </td>

                    <td>
                        {{ number_format($subCounty['books_pending']) }}
                    </td>

                    <td>
                        {{ $subCounty['progress'] }}%
                    </td>

                </tr>

            @endforeach


            {{-- TOTAL ROW --}}

            <tr class="totals">

                <td>
                    COUNTY TOTAL
                </td>

                <td>
                    {{ number_format($county['total']) }}
                </td>

                <td>
                    {{ number_format($county['delivered']) }}
                </td>

                <td>
                    {{ number_format($county['pending']) }}
                </td>

                <td>
                    {{ number_format($county['books_allocated']) }}
                </td>

                <td>
                    {{ number_format($county['books_delivered']) }}
                </td>

                <td>
                    {{ number_format($county['books_pending']) }}
                </td>

                <td>
                    {{ $county['progress'] }}%
                </td>

            </tr>

        </tbody>

    </table>


    <div class="footer">

        Bowen Book Management System

    </div>

</body>
</html>