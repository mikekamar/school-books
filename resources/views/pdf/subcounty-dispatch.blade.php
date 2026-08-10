<!DOCTYPE html>

@php
    $logo = public_path('images/bowenHeader.png');
@endphp

<html>

<head>
    <meta charset="utf-8">

    <style>

        body{
            font-family: DejaVu Sans, sans-serif;
            font-size:12px;
            color:#222;
        }

        h1,h2,h3{
            margin:0;
        }

        table{
            width:100%;
            border-collapse:collapse;
        }

        .header{
            margin-bottom:20px;
            border-bottom:2px solid #333;
            padding-bottom:12px;
        }

        .title{
            font-size:22px;
            font-weight:bold;
        }

        .subtitle{
            color:#666;
            margin-top:4px;
        }

        .section-title{
            margin-top:25px;
            margin-bottom:10px;
            font-size:15px;
            font-weight:bold;
            border-bottom:1px solid #999;
            padding-bottom:4px;
        }

        .info td{
            padding:6px 0;
        }

        .summary{
            width:100%;
            border-collapse:collapse;
            margin-top:10px;
        }

        .summary td{
            border:1px solid #666;
            padding:10px;
        }

        .summary .label{
            background:#f2f2f2;
            font-weight:bold;
            width:25%;
        }

        .summary .value{
            text-align:center;
            font-weight:bold;
            width:25%;
        }

        .summary .progress{
            text-align:center;
            font-size:18px;
            font-weight:bold;
        }

        .schools{
            width:100%;
            border-collapse:collapse;
            margin-top:10px;
            font-size:11px;
        }

        .schools th{
            border: 1px solid #000;
            padding: 2px 5px;      /* Reduced from 6px */
            height: 20px;          /* Excel-like row height */
            line-height: 1.1;
            vertical-align: middle;
        }

        .schools td{
            border: 1px solid #000;
            padding: 2px 5px;      /* Reduced from 6px */
            height: 20px;          /* Excel-like row height */
            line-height: 1.1;
            vertical-align: middle;
        }

        .schools tbody tr:nth-child(even){
            background:#f8f8f8;
        }

        .status{
            display:inline-block;
            padding:4px 10px;
            border-radius:3px;
            font-size:10px;
            font-weight:bold;
            text-align:center;
        }

        .delivered{
            background:#d1fae5;
            color:#065f46;
            border:1px solid #10b981;
        }

        .partial{
            background:#fef3c7;
            color:#92400e;
            border:1px solid #f59e0b;
        }

        .pending{
            background:#fee2e2;
            color:#991b1b;
            border:1px solid #ef4444;
        }

        .books{
            width:100%;
            border-collapse:collapse;
            margin-top:10px;
            font-size:10px;
        }

        .books th{
            background:#dbeafe;
            border:1px solid #666;
            padding:6px;
            text-align:left;
        }

        .books td{
            border:1px solid #999;
            padding:5px;
        }

        .overall{
            width:60%;
            border-collapse:collapse;
            margin-top:10px;
        }

        .overall td{
            border:1px solid #777;
            padding:8px;
        }

        .overall td:first-child{
            background:#f3f4f6;
            font-weight:bold;
            width:70%;
        }

        .overall td:last-child{
            text-align:right;
            font-weight:bold;
        }

        .signature-table{
            width:100%;
            margin-top:30px;
        }

        .signature-table td{
            border:none;
            vertical-align:top;
            width:50%;
            padding:15px;
        }

        body{
    font-family: DejaVu Sans, sans-serif;
    font-size:12px;
    color:#222;
}

.section-title{
    background:#f2f2f2;
    padding:8px;
    margin-top:20px;
    border-left:5px solid #0b5ed7;
}

.summary-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 15px;
    font-family: Calibri, Arial, sans-serif;
    font-size: 12pt;
}

.summary-table th{
    text-align: center;
}
.summary-table td {
    border: 1px solid #000;
    padding: 2px 5px;      /* Reduced from 6px */
    height: 20px;          /* Excel-like row height */
    line-height: 1.1;
    vertical-align: middle;
    text-align: right;
}

.summary-table thead th {
    background: #e9ecef;
    font-weight: bold;
}

.summary-table tbody td {
    font-weight: normal;
}

.progress {
    font-weight: bold;
}

    </style>

</head>

<body>

<div class="header">

    <div style="text-align:center; margin-bottom:15px;">
    <img
        src="{{ public_path('images/bowenHeader.png') }}"
        style="width:100%; height:auto;"
        alt="Bowen Logo">
</div>

<h1 style="text-align:center; margin:0;">
    School Books Delivery Report
</h1>

<h3 style="text-align:center; margin-top:5px; color:#666;">
    Bowen Book Distribution System
</h3>
</div>


<h2 class="section-title">Dispatch Information</h2>

<table class="summary-table">
    <tr>
        <td><strong>County</strong></td>
        <td>{{ $dispatch->county->name }}</td>
        
        <td><strong>Dispatch Number</strong></td>
        <td>{{ $dispatch->dispatch_number }}</td>

    </tr>

    <tr>
        <td><strong>Sub County</strong></td>
        <td>{{ $subCounty->name }}</td>

        <td><strong>Dispatch Date</strong></td>
        <td>{{ $dispatch->dispatch_date }}</td>

    </tr>

    <tr>
        <td><strong>Field Agent</strong></td>
        <td>{{ $assignment->fieldAgent->name }}</td>

        <td><strong>Status</strong></td>
        <td>{{ $dispatch->status }}</td>
    </tr>

    <tr>
        <td><strong>Generated On</strong></td>
        <td colspan="3">
            {{ now()->format('d M Y H:i') }}
        </td>
    </tr>
</table>

<h3 class="section-title">
    School Delivery Summary
</h3>

<table class="summary-table">
    <thead>
        <tr>
            <th>Total Schools</th>
            <th>Delivered</th>
            <th>Partial</th>
            <th>Pending</th>
            <th>Progress</th>
        </tr>
    </thead>

    <tbody>
        <tr>
            <td>{{ $summary['total_schools'] }}</td>
            <td>{{ $summary['delivered_schools'] }}</td>
            <td>{{ $summary['partial_schools'] }}</td>
            <td>{{ $summary['pending_schools'] }}</td>
            <td class="progress">{{ $summary['school_progress'] }}%</td>
        </tr>
    </tbody>
</table>


<h3 class="section-title">
    Book Delivery Summary
</h3>

<table class="summary-table">
    <thead>
        <tr>
            <th>Allocated Books</th>
            <th>Received Books</th>
            <th>Balance Books</th>
            <th>Damaged Books</th>
            <th>Progress</th>
        </tr>
    </thead>

    <tbody>
        <tr>
            <td>{{ number_format($summary['allocated_books']) }}</td>
            <td>{{ number_format($summary['received_books']) }}</td>
            <td>{{ number_format($summary['missing_books']) }}</td>
            <td>{{ number_format($summary['damaged_books']) }}</td>
            <td class="progress">{{ $summary['book_progress'] }}%</td>
        </tr>
    </tbody>
</table>

<div style="page-break-before: always;"></div>

<h2>School Delivery Register</h2>

<table class="schools">

    <thead>

        <tr>

            <th style="width:4%;">#</th>

            <th style="width:30%;">School</th>

            <th style="width:6%;">UIC</th>

            <th style="width:8%;">Status</th>

            <th style="width:22%;">Receiver</th>

            <th style="width:20%;">Phone</th>

            <th style="width:10%;">Date</th>

        </tr>

    </thead>

    <tbody>

        @foreach($items as $index => $item)

            <tr>

                <td>{{ $index + 1 }}</td>

                <td>{{ $item->school->school_name }}</td>

                <td>{{ $item->school->uic }}</td>

                <td style="text-align:center;">

                    @if($item->status === 'Delivered')

                        <span class="status delivered">
                            DELIVERED
                        </span>

                    @elseif($item->status === 'Partial')

                        <span class="status partial">
                            PARTIAL
                        </span>

                    @else

                        <span class="status pending">
                            PENDING
                        </span>

                    @endif

                </td>

                <td>{{ $item->receiver_name ?? '-' }}</td>

                <td>{{ $item->receiver_phone ?? '-' }}</td>

                <td>
                    {{ $item->delivered_at ? $item->delivered_at->format('d/m/Y') : '-' }}
                </td>

            </tr>

        @endforeach

    </tbody>

</table>

{{-- <h3 class="section-title">
    Book Reconciliation Summary
</h3>

<table class="books">

    <thead>

        <tr>

            <th style="width:32%;">School</th>

            <th style="width:23%;">Book</th>

            <th style="width:11%;">Allocated</th>

            <th style="width:11%;">Received</th>

            <th style="width:11%;">Shortage</th>

            <th style="width:12%;">Damaged</th>

        </tr>

    </thead>

    <tbody>

    @foreach($items as $item)

        @foreach($item->books as $book)

        <tr>

            <td>

                {{ $item->school->school_name }}

            </td>

            <td>

                {{ $book->book->name }}

            </td>

            <td style="text-align:center;">

                {{ $book->allocated_quantity }}

            </td>

            <td style="text-align:center;">

                {{ $book->received_quantity }}

            </td>

            <td style="text-align:center; color:red; font-weight:bold;">

                {{ max(0, $book->allocated_quantity - $book->received_quantity) }}

            </td>

            <td style="text-align:center;">

                {{ $book->damaged_quantity }}

            </td>

        </tr>

        @endforeach

    @endforeach

    </tbody>

</table> --}}

<h3 class="section-title">
    Certification
</h3>

<p style="margin-bottom:25px;">
    I certify that the information contained in this report accurately reflects
    the delivery status and reconciliation of books distributed to schools
    within <strong>{{ $subCounty->name }}</strong>.
</p>

<table class="signature-table">

    <tr>

        <td>

            <strong>Prepared By</strong><br><br>

            _______________________________<br>

            {{ $assignment->fieldAgent->name }}<br>

            Field Agent<br><br>

            Date: _________________________

        </td>

        <td>

            <strong>Verified By</strong><br><br>

            _______________________________<br>

            Store Manager<br><br>

            Date: _________________________

        </td>

    </tr>

    <tr>

        <td colspan="2" style="padding-top:45px;">

            <strong>Approved By</strong><br><br>

            _______________________________<br>

            County Director<br><br>

            Date: _________________________

        </td>

    </tr>

</table>

    <hr style="margin-top:40px;">

    <table style="width:100%; font-size:10px; color:#666;">

    <tr>

    <td>

    Generated on:

    {{ now()->format('d M Y H:i') }}

    </td>

    <td style="text-align:right;">

    Book Distribution Management System

    </td>

    </tr>

    </table>

</body>

</html>